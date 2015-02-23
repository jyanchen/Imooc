var User = require("../models/user");

exports.list = function(req, res) {
	User.fetch(function(err, users) {
		if (err)
			console.log(err);

		res.render("userlist", {
			title: "imooc 用户列表页",
			users: users
		});
	});
};

// 注册登录-单页面
// 注册
exports.showSignup = function(req, res) {
	res.render("signup", {
		title: "注册页面",
	});
};
// 登录
exports.showSignin = function(req, res) {
	res.render("signin", {
		title: '登录页面'
	})
};

// 注册登录-逻辑处理
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
			return res.redirect('/signin');
		} else {
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				res.redirect('/');
			});
		}
	})
};

//登录
exports.signin = function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

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
			console.log('用户不存在');
			return res.redirect('/signup');
		}

		// 用bcrypt，校验密码是否正确
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err);
			}

			if (isMatch) {
				// 保存用户信息到session
				req.session.user = user;
				return res.redirect('/');
			} else {
				console.log("登录失败!!!");
				return res.redirect('/signin');
			}
		})
	})
};

// 注销logout
exports.logout = function(req, res) {
	// 需要同时删除session和已保存到本地的变量信息
	delete req.session.user;
	// delete app.locals.user;
	res.redirect('/');
};

// middleware
exports.signinRequired = function(req, res, next) {
	var user = req.session.user;

	if (!user) {
		return res.redirect('/signin');
	}
	next();
};

exports.adminRequired = function(req, res, next) {
	var user = req.session.user;

	if (!user.role || user.role <= 10) {
		return res.redirect('/signin');
	}
	next();
};