var express = require("express");
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require("path");
var mongoose = require("mongoose");
var mongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 3000;
var app = express();
var multipart = require('connect-multiparty');
var dburl = "mongodb://localhost/imooc";

// 连接数据库
mongoose.connect(dburl);

// 配置jade模版引擎
app.set("views", "./app/views/pages");
app.set("view engine", "jade");
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(multipart());
app.use(bodyParser.json());

// cookie相关的配置
app.use(cookieParser());
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: dburl,
		conlection: 'session'
	})
}));

if('development' == app.get('env')){
	// 记录错误栈。true：把错误打印在屏幕
	app.set('showStackError',true);
	// 记录请求的方式、URL地址、状态
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug'.true);
}

// 导入路由文件
require('./config/routes')(app);

app.listen(port);
app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, "public")));

console.log("imooc started on port " + port);

