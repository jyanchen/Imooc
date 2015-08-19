var mongoose = require("mongoose");
var Movie = require("../models/movie");
var Category = require("../models/category");

exports.index = function(req, res) {

    // Category
    //     .find({})
    //     .populate({
    //         path: "movies",
    //         options: {
    //             // limit: 5
    //         }
    //     })
    //     .sort({
    //         "meta.updateAt": -1
    //     })
    //     .exec(function(err, categories) {
    //         if (err)
    //             console.log(err);
    //         res.render("index", {
    //             title: "movieDB - 首页",
    //             categories: categories
    //         });
    //     })
    //     

    // Movie.aggregate([{
    //     $match: {
    //         "watched": {
    //             "$gt": -1,
    //             "$lt": 2
    //         }
    //     }
    // }, {
    //     $group: {
    //         _id: "$watched",
    //         items: {
    //             item: "$watched.push()"
    //         }
    //     }
    // }], function(err, results) {
    //     console.log(results);
    //     res.render("index", {
    //         title: "movieDB - 首页",
    //         movies: results
    //     });
    // })
    // 
    // 
    

    Movie
        .find({})
        .exec(function(err,movies){
            var results = {
                wish:[],
                watched:[]
            }
            for(var i=0,len=movies.length;i<len;i++){
                if(movies[i].watched == 1){
                    results.watched.push(movies[i])
                }else if(movies[i].watched == 0){
                    results.wish.push(movies[i])
                }
            }
            // console.log(results);
            res.render("index",{
                title: "movieDB - 首页",
                movies: results
            });
        })

};

exports.search = function(req, res) {
    var cate = req.query.cate, // 分类
        keyword = req.query.q, // 关键字搜索的关键字
        id = req.query.id, // 豆瓣id
        page = parseInt(req.query.p, 10) || 0, // 默认页数为1
        count = 6,
        index = page * count;

    // 是否分类搜索还是关键字搜索
    if (cate) {
        Category
            .find({
                name: cate
            })
            .populate({
                path: "movies",
                select: "title poster"
            })
            .exec(function(err, categories) {
                var category = categories[0] || {},
                    movies = category.movies || [],
                    results = movies.slice(index, index + count);

                if (err)
                    console.log(err);

                res.render("results", {
                    title: "movieDB - 结果列表页",
                    keyword: category.name,
                    cateId: cateId,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            })
    } else if (id) {
        Movie
            .find({
                DouBanId: id.toString()
            })
            .exec(function(err, movie) {
                if (err)
                    console.log(err);

                if (!movie.length) {
                    if (req.query.for == "checkDBId") {
                        res.json({
                            exist: false
                        });
                    } else {
                        res.render("results", {
                            title: "movieDB - 结果列表页",
                            keyword: keyword,
                            movies: movie
                        });
                    }
                } else {

                    if (req.query.for == "checkDBId") {
                        res.json({
                            "movie": movie,
                            "exist": true
                        })
                    } else {
                        res.render("results", {
                            title: "movieDB - 结果列表页",
                            keyword: keyword,
                            movies: movie
                        });
                    }
                }
            })
    } else {
        /**
         * Nodejs下对Mongodb进行模糊查询
         * 参考文章：https://cnodejs.org/topic/50ca70dd637ffa4155549a53
         **/
        var pattern = new RegExp("^.*" + keyword + ".*$"),
            q = {};
        if (pattern) {
            q.title = pattern;
        }


        Movie
            .find(q)
            .exec(function(err, movies) {
                var results = movies.slice(index, index + count);

                if (err)
                    console.log(err);

                res.render("results", {
                    title: "movieDB - 结果列表页",
                    keyword: keyword,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            })
    }
};
