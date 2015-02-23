var Movie = require("../models/movie");
var Category = require("../models/category");

exports.index = function(req, res) {

	Category
		.find({})
		.populate({
			path: 'movies',
			options: {
				// limit: 5
			}
		})
		.sort({'meta.updateAt':-1})
		.exec(function(err, categories) {
			if (err)
				console.log(err);
			debugger;
			res.render("index", {
				title: "imooc 首页",
				categories: categories
			});
		})
};

exports.search = function(req, res) {
	var cateId = req.query.cate;
	var keyword = req.query.keyword; // 关键字搜索的关键字
	var page = parseInt(req.query.p, 10) || 0; // 默认页数为1
	var count = 6;
	var index = page * count;

	// 是否分类搜索还是关键字搜索
	if (cateId) {
		Category
			.find({
				_id: cateId
			})
			.populate({
				path: 'movies',
				select: 'title poster'
			})
			.exec(function(err, categories) {
				var category = categories[0] || {};
				var movies = category.movies || []
				var results = movies.slice(index, index + count);

				if (err)
					console.log(err);

				res.render("results", {
					title: "imooc 结果列表页",
					keyword: category.name,
					cateId: cateId,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / count),
					movies: results
				});
			})
	} else {
		/**
		* Nodejs下对Mongodb进行模糊查询
		* 参考文章：https://cnodejs.org/topic/50ca70dd637ffa4155549a53
		**/
		var pattern = new RegExp("^.*"+keyword+".*$");
		var q = {};
		if(pattern){
			q.title = pattern;
		}

		Movie
			.find(q)
			.exec(function(err, movies) {
				var results = movies.slice(index, index + count);

				if (err)
					console.log(err);

				res.render("results", {
					title: "imooc 结果列表页",
					keyword: keyword,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / count),
					movies: results
				});
			})
	}
};