var Index = require("../app/controllers/index");
var User = require("../app/controllers/user");
var Movie = require("../app/controllers/movie");
var Category = require("../app/controllers/category");
var Comment = require("../app/controllers/comment");

module.exports = function(app) {

    // 预处理用户登录验证
    app.use(function(req, res, next) {
        // 检测用户登录   
        var _user = req.session.user;
        // 保存用户信息到本地变量,供后面的程序使用
        app.locals.user = _user;
        next();
    });

    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    // Index 
    app.get("/", Index.index);

    // Movie
    app.get("/admin/movie/list", User.signinRequired, User.adminRequired, Movie.list); // 列表页
    app.get("/movie/:id", Movie.detail); // 详情页
    app.get("/admin/movie/record", User.signinRequired, User.adminRequired, Movie.record); // 录入页
    app.post("/admin/movie", User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save); // 保存
    app.get("/admin/movie/update/:id", User.signinRequired, User.adminRequired, Movie.update); // 更新
    app.delete("/admin/movie/list", User.signinRequired, User.adminRequired, Movie.del); // 删除

    // User
    app.get("/admin/user/list", User.signinRequired, User.adminRequired, User.list); // 用户列表
    app.post('/user/signup', User.signup); // 注册-逻辑处理
    app.post('/user/signin', User.signin); // 登录-逻辑处理
    app.get('/signin', User.showSignin); // 注册-单页面
    app.get('/signup', User.showSignup); // 登录-单页面
    app.get('/logout', User.logout); // 注销
    // app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.del) // 删除用户

    // Comment
    app.post('/user/comment', User.signinRequired, Comment.save);

    // Category
    app.get("/admin/category/record", User.signinRequired, User.adminRequired, Category.record); // 录入
    app.post("/admin/category", User.signinRequired, User.adminRequired, Category.save); // 保存
    app.get("/admin/category/list", User.signinRequired, User.adminRequired, Category.list); // 列表
    app.get("/admin/category/update/:id", User.signinRequired, User.adminRequired, Category.update); // 更新 

    // search
    app.get("/search", Index.search);
}
