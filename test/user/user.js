var crypto = require("crypto");
var bcrypt = require("bcrypt");
var should = require("should");
var app = require("../../app");
var mongoose = require("mongoose");
// var User = require("../../app/models/user");
var User = mongoose.model("User");

var Obj_user;

// 生成随机的字符串，作为用户名
function getRandomString(len) {
	if (!len) len = 16;
	return crypto.randomBytes(Math.ceil(len / 2)).toString("hex");
}

// 开始测试用例
/**
* describe (string, function)
* string：测试组名称
* function：测试组函数
*
*  一个测试组开始于全局函数describe，一个describe是一个it的集合。describe包含n个it，一个it包含n个判断断言
**/
describe("<Unit Test",function(){
	describe("Model User:",function(){

		/**
		* before(done)
		* done: 执行用例
		*
		* 用例开始执行前调用，主要用于声明测试时要用到的变量和要用到的函数
		**/
		before(function(done){
			Obj_user = {
				name:getRandomString(),
				password:"password"
			}

			done();
		});

		// 保存之前先检查数据库，有没有相同的用户名
		describe("Before Method save",function(){
			it("should begin without test user",function(done){
				User.find({name:Obj_user.name},function(err,users){
					users.should.have.length(0);

					done();
				})
			})
		});

		// 保存用户信息
		describe("User save",function(){
			it("should save without problems",function(done){
				var _user = new User(Obj_user);

				_user.save(function(err){
					// 报错就停止往下走
					should.not.exist(err);

					// 成功后，删除用户信息
					_user.remove(function(err){
						should.not.exist(err);
						done();
					})
				})
			})

			// 检查密码是否正确
			it("should password is correct",function(done){
				var password = Obj_user.password;
				var _user = new User(Obj_user);

				_user.save(function(err){
					// 报错就停止往下走
					should.not.exist(err);
					_user.password.should.not.have.length(0);

					bcrypt.compare(password,_user.password,function(err,isMatch){
						should.not.exist(err);
						isMatch.should.equal(true);

						_user.remove(function(err){
							should.not.exist(err);
							done();
						})
					})
				})
			})

			// 检查权限
			it("should have default role 0",function(done){
				var _user = new User(Obj_user);

				_user.save(function(err){
					_user.role.should.equal(0);

					_user.remove(function(err){
						done();
					})
				})
			})

			// 检查权限
			it("user is existed",function(done){
				var _user1 = new User(Obj_user);

				_user1.save(function(err){
					should.not.exist(err);

					var _user2 = new User(Obj_user);

					_user2.save(function(err){
						should.exist(err);

						_user1.remove(function(err){
							if(!err){
								_user2.remove(function(err){
									done();
								})
							}
						})
					})
				})
			})
		})

		after(function(done){
			// clear user info
			done();
		})
	})
})