var Movie = require("../models/movie");
var Comment = require("../models/comment");
var Category = require("../models/category");
var _ = require("underscore");
var fs = require("fs");
var path = require("path");
var http = require("http"); 

//detail page 
exports.detail = function(req, res) {
	var id = req.params.id;

	Movie.findById(id, function(err, movie) {

		// 设置电影访问人数
		Movie.update({_id: id},{$inc: {pv:1}},function(err){
			if(err) console.log(err);
		})

		Comment
			.find({
				movie: id
			}) // 先找到电影的id,即关于这部电影的所有信息
			.populate('from', 'name') // 通过Mongodb的populate关联查询，查找出评论者的名字
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments) {
				res.render("detail", {
					title: "imooc " + movie.title,
					movie: movie,
					comments: comments
				});
			});
	});
};

//admin page 
exports.new = function(req, res) {
	Category.find({}, function(err, categories) {
		if (err) console.log(err);

		res.render("admin", {
			title: "imooc 后台录入页",
			categories: categories,
			movie: {}
		});
	})
};

// admin update movie
exports.update = function(req, res) {
	var id = req.params.id;

	if (id) {
		Movie.findById(id, function(err, movie) {
			Category.find({}, function(err, categories) {
				res.render('admin', {
					title: 'imooc 后台更新页',
					movie: movie,
					categories: categories
				});
			})
		})
	}
};

// admin poster 海报上传
exports.savePoster = function(req, res, next) {
	var movieObj = req.body.movie;
	// 获取表单中file input的数据
	var posterData = req.files.movie.uploadPoster;
	// 获取文件的路径
	var filePath = posterData.path;
	// 获取文件名
	var originalFileName = posterData.originalFilename;

	if (originalFileName) {
		fs.readFile(filePath, function(err, data) {
			var timeStamp = Date.now(); // 创建一个时间戳，默认为poster的名
			var type = posterData.type.split('/')[1]; // 获取文件格式/后缀
			var poster = timeStamp + '.' + type; // 新建一个poster对象
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster); // poster的新路径（保存到本地的路径）

			fs.writeFile(newPath, data, function(err) {
				req.poster = poster; // 在请求头部添加一个poster值
				next();
			})
		})
	} else if (movieObj.poster.indexOf('http') > -1) {
		var server = http.createServer(function(req, res) {}).listen(50082);
		http.get(movieObj.poster, function(res) {
			var imgData = "";
			var poster = Date.now() + (Math.floor(Math.random() * 3)) + '.jpg';

			res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

			res.on("data", function(chunk) {
				imgData += chunk;
			});

			res.on("end", function() {
				var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
				fs.writeFile(newPath, imgData, "binary", function(err) {
					if (err) {
						console.log(err);
					}
					movieObj.poster = poster;
					next();
					server.close();    // 保存完图片一定要，否则保存下部电影时会报错
				});
			});
		});
	} else {
		next();
	}
};

// admin post movie
exports.save = function(req, res) {
	var movieObj = req.body.movie;
	var id = movieObj._id;
	var _movie = new Movie({});

	if (req.poster) {
		movieObj.poster = req.poster;
	}

	// 电影已经存在，则更新
	if (id) {
		Movie.findById(id, function(err, movie) {
			if (err)
				console.log(err);
			console.log('save :' + movieObj.poster);
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if (err)
					console.log(err);
				res.redirect("/movie/" + movie._id);
			});
		})
	} else {
		_movie = new Movie(movieObj);
		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err)
			}

			if (categoryId) {
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie._id);
					category.save(function(err, category) {
						res.redirect("/admin/movie/new");
					})
				})
			} else if (categoryName) {
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				});
				category.save(function(err, category) {
					movie.category = category._id;
					movie.save(function(err, movie) {
						res.redirect("/admin/movie/new");
					});
				})
			}
		});
	}
};

//list page 
exports.list = function(req, res) {
	Movie.find(function(err, movies) {
		if (err)
			console.log(err);

		res.render("list", {
			title: "imooc 列表页",
			movies: movies
		});
	});
};

// list delete movie
exports.del = function(req, res) {
	var id = req.query.id;

	if (id) {
		Movie.findOne({_id: id},function(err,movie){
			// 获取电影的在本地额路径
			var imgPath = path.join(__dirname, '../../', '/public/upload/' + movie.poster);

			// 在分类中删除该电影，应该在schemas的movie.js写（参照save）

			// 在分类中删除该电影的ObjectId
			Category.update({"_id": movie.category}, {$pull: {movies: movie._id}}, function(err){
				if(err){
					console.log('delete relate category movie,failed');
				}else{
					// 删除电影
					Movie.remove({_id: id}, function(err, result){
						if (err) {
							console.log(err);
						} else {	

							// 删除结果返回前端，执行相应处理
							res.json({
								/**
								* result{0:失败,1:成功}
								**/
								success: result
							});

							// 删除本地海报
							fs.unlink(imgPath,function(err){
								if(err) console.log(err);
							})
						}
					})
				}
			});
		})
	}
};