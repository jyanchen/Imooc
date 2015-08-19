var Movie = require("../models/movie"),
    Comment = require("../models/comment"),
    Category = require("../models/category"),
    _ = require("underscore"),
    fs = require("fs"),
    path = require("path"),
    http = require("http"),
    async = require("async");


// 电影列表
exports.list = function(req, res) {
    // Movie.find(function(err, movies) {
    //     if (err)
    //         console.log(err);

    //     res.render("list", {
    //         title: "movieDB -列表页",
    //         movies: movies
    //     });
    // });

    Movie
        .find()
        .populate("category")
        .exec(function(err, result) {
            console.log(result)
            res.render("list", {
                title: "movieDB -列表页",
                movies: result
            })
        })
};

// 电影详情
exports.detail = function(req, res) {
    var id = req.params.id;

    Movie.findById(id, function(err, movie) {
        var cat = [];
        // 设置电影访问人数
        Movie.update({
            _id: id
        }, {
            $inc: {
                pv: 1
            }
        }, function(err, movie) {
            if (err) console.log(err);
        });

        Comment
            .find({
                movie: id
            }) // 先找到电影的id,即关于这部电影的所有信息
            .populate("from", "name") // 通过Mongodb的populate关联查询，查找出评论者的名字
            .populate("reply.from reply.to", "name")
            .exec(function(err, comments) {
                Category.findById(movie.category, function(e, c) {
                    // cat.push(c.name)
                    res.render("detail", {
                        title: "movieDB -" + movie.title,
                        movie: movie,
                        comments: comments,
                        category: c.name
                    });
                })
            });
    });
};

// 录入电影 
exports.record = function(req, res) {
    Category.find({}, function(err, categories) {
        if (err) console.log(err);

        res.render("admin/editMovie", {
            title: "movieDB - 后台录入页",
            categories: categories,
            movie: {}
        });
    })
};

// 更新电影
exports.update = function(req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, categories) {
                res.render("admin/editMovie", {
                    title: "movieDB - 后台更新页",
                    movie: movie,
                    categories: categories
                });
            })
        })
    }
};

// 海报上传
exports.savePoster = function(req, res, next) {
    var movieObj = req.body.movie, // 获取表单中file input的数据
        posterData = req.files.movie.uploadPoster, // 获取文件的路径
        filePath = posterData.path, // 获取文件名
        originalFileName = posterData.originalFilename;

    if (originalFileName || (movieObj.oldPoster != "" && movieObj.poster != movieObj.oldPoster)) {
        var imgPath = path.join(__dirname, "../../", "/public/upload/", movieObj.oldPoster);
        fs.exists(imgPath, function(exists) {
            fs.unlink(imgPath, function(err) {
                if (err)
                    console.log(err);
            })
        })
    }

    if (originalFileName) {
        fs.readFile(filePath, function(err, data) {
            var timeStamp = Date.now(); // 创建一个时间戳，默认为poster的名
            var type = posterData.type.split("/")[1]; // 获取文件格式/后缀
            var poster = timeStamp + "." + type; // 新建一个poster对象
            var newPath = path.join(__dirname, "../../", "/public/upload/temp/" + poster); // poster的新路径（保存到本地的路径）

            fs.writeFile(newPath, data, function(err) {
                movieObj.poster = poster; // 在请求头部添加一个poster值
                next();
            })
        })
    } else if (movieObj.poster.indexOf("http") > -1) {
        var server = http.createServer(function(req, res) {}).listen(50082);
        http.get(movieObj.poster, function(res) {
            var imgData = "";
            var poster = Date.now() + (Math.floor(Math.random() * 3)) + movieObj.poster.match(/\.(jpg$|gif$|bmp$)/g);

            res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

            res.on("data", function(chunk) {
                imgData += chunk;
            });

            res.on("end", function() {
                var newPath = path.join(__dirname, "../../", "/public/upload/" + poster);
                fs.writeFile(newPath, imgData, "binary", function(err) {
                    if (err) {
                        console.log(err);
                    }
                    movieObj.poster = poster;
                    next();
                    server.close(); // 保存完图片一定要，否则保存下部电影时会报错
                });
            });
        });
    } else {
        next();
    }
};

function delPoster(name) {
    var imgPath = path.join(__dirname, "../../", "/public/upload/" + name);
    fs.exists(imgPath, function(exists) {
        if (exists) {
            fs.unlink(imgPath, function(err) {
                if (err)
                    console.log(err);
            })
        } else {
            console.log("========3 控制台打印")
            console.log("路径不存在，删除失败。")
            console.log("========3 控制台打印")
        }
    })
}


// 速度太慢了
// 
function moveImg(name) {
    var temp = path.join(__dirname, "../../", "/public/upload/temp/" + name),
        upload = path.join(__dirname, "../../", "/public/upload/" + name);

    fs.exists(temp, function(exists) {
        if (exists) {
            var readStream = fs.createReadStream(temp),
                writeStream = fs.createWriteStream(upload);

            readStream.pipe(writeStream);
            readStream.on('end', function() {
                fs.unlinkSync(temp, function(err) {
                    if (err)
                        console.log(err);
                })
                console.log("图片复制成功");
            });
            readStream.on('error', function() {
                console.log("图片复制失败");
            });
        }
    })
}

// 保存电影
exports.save = function(req, res) {
    var movieObj = req.body.movie,
        _movie = new Movie({});

    Movie.findOne({
        title: movieObj.title,
        doctor: movieObj.doctor
    }, function(err, movie) {

        // 电影已存在，则更新
        if (movie && movie._id) {

            // delPoster(movie.poster);

            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err)
                    console.log(err);

                movie.meta.updateAt = Date.now();
                // moveImg(movie.poster);

                // if (movieObj.oldPoster)
                // delPoster(movieObj.oldPoster);

                res.redirect("/movie/" + movie._id);
                return;
            });
        } else {
            var categoryId = movieObj.category,
                categoryName = movieObj.categoryName;

            _movie = new Movie(movieObj);
            _movie.save(function(err, movie) {
                if (err)
                    console.log(err);

                if (categoryId) {
                    // 分类存在
                    Category.findById(categoryId, function(err, category) {
                        category.movies.push(movie._id);
                        category.save(function(err, category) {
                            // moveImg(movie.poster);
                            res.redirect("/admin/movie/record");
                            return;
                        })
                    })
                } else if (categoryName) {
                    // 分类不存在
                    // 先创建分类
                    var category = new Category({
                        name: categoryName,
                        movies: [movie._id]
                    });

                    category.save(function(err, category) {
                        movie.category = category._id;
                        movie.save(function(err, movie) {
                            // moveImg(movie.poster);
                            res.redirect("/admin/movie/record");
                            return;
                        })
                    })
                }
            })
        }
    });
};


// 删除电影
exports.del = function(req, res) {
    var id = req.query.id;

    if (id) {
        Movie.findOne({
            _id: id
        }, function(err, movie) {
            // 获取电影海报在本地路径
            var imgPath = path.join(__dirname, "../../", "/public/upload/" + movie.poster);

            // 在分类中删除该电影，应该在schemas的movie.js写（参照save）
            // 在分类中删除该电影的ObjectId
            Category.update({
                "_id": movie.category
            }, {
                $pull: {
                    movies: movie._id
                }
            }, function(err) {
                if (err) {
                    console.log("电影所在的分类，找不到该电影");
                } else {
                    // 删除电影
                    Movie.remove({
                        _id: id
                    }, function(err, result) {
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
                            fs.unlink(imgPath, function(err) {
                                if (err) console.log(err);
                            })
                        }
                    })
                }
            });
        })
    }
};
