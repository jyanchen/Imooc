// 跳转到注册登录前浏览的页面
// 只有需要登录和管理员的权限的页面做了跳转
// 其它页面暂时没做，注册成功和注销成功都只是返回首页

var User = require("../models/user");

exports.list = function(req, res) {
    User.fetch(function(err, users) {
        if (err)
            console.log(err);

        res.render("user/userlist", {
            title: "movieDB - 用户列表页",
            users: users
        });
    });
};

// 页面渲染
// 注册
exports.showSignup = function(req, res) {
    res.render("user/signup", {
        title: "注册页面"
    });
};
// 登录
exports.showSignin = function(req, res) {
    res.render("user/signin", {
        title: "登录页面",
        referer: req.query.returnURL
    })
};

// 逻辑处理
// 注册
exports.signup = function(req, res) {
    var _user = req.body.user;

    User.findOne({
        name: _user.name
    }, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (user) { // 用户已存在，返回首页
            return res.redirect("/signin");
        } else {
            user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect("/signin");
            });
        }
    })
};

//登录
exports.signin = function(req, res) {
    var _user = req.body.user,
        name = _user.name,
        password = _user.password,
        referer = req.body.referer == "undefined" ? "/" : decodeURIComponent(req.body.referer);

    if (name == "" || password == "") {
        return res.redirect("/signin");
    }

    /**
     * findOne: return {}; 返回的是单个信息
     * find: retrun []; 返回的是信息列表集合
     */
    User.findOne({
        name: name
    }, function(err, user) {
        if (err) {
            console.log(err);
        }

        if (!user) {
            console.log("用户不存在");
            return res.redirect("/signup");
        }

        // 用bcrypt，校验密码是否正确
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }
            console.log(req)
            if (isMatch) {

                User.update({
                    _id: user.id
                }, {
                    $set: {
                        "lastest._ip": req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress,
                        "lastest.time": Date.now()
                    }
                }, function(err, user) {
                    if (err)
                        console.log(err);
                })

                // 保存用户信息到session
                req.session.user = user;
                return res.redirect(referer);
            } else {
                console.log("登录失败!!!");
                return res.redirect("/signin");
            }
        })
    })
};

// 注销logout
exports.logout = function(req, res) {
    // 需要同时删除session和已保存到本地的变量信息
    delete req.session.user;
    // delete app.locals.user;
    res.redirect("/");
};

// 删除用户
exports.del = function(req, res) {
    User.findOne({
        _id: req.query.id
    }, function(err, user) {
        if (err)
            console.log(err);

        if (user) {
            User.remove({
                _id: req.query.id
            }, function(err, results) {
                if (err)
                    console.log(err);

                res.json({
                    success: results
                })
            })
        }
    })
}

// middleware
// 需要登录
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;

    if (!user) {
        // return res.redirect("/signin");
        return res.redirect("/signin?returnURL=" + encodeURIComponent(req.route.path));
    }
    next();
};

// 需要管理员权限
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;

    if (!user.role || user.role <= 10) {
        // return res.redirect("/signin");
        return res.redirect("/signin?returnURL=" + encodeURIComponent(req.route.path));
    }
    next();
};
