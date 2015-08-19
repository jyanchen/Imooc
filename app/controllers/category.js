var Category = require("../models/category"),
    Movie = require("../models/movie")

//admin page 
exports.record = function(req, res) {
    res.render("admin/editCategory", {
        title: "movieDB - 后台分类录入页",
        category: null
    });
};

// admin post movie
exports.save = function(req, res) {
    var _category = req.body.category;
    var category = new Category(_category);

    category.save(function(err, category) {
        if (err)
            console.log(err)

        res.redirect("/admin/category/record");
    });
};

// list page
var movies = {},
    arr = {};

exports.list = function(req, res) {
    Category
        .find()
        .populate("movies")
        .exec(function(err, result) {
            if (err) console.log(err)
                // console.log(result)
            res.render("admin/categorylist", {
                title: "movieDB - 分类列页",
                categories: result
            });
        });
};

exports.update = function(req, res) {
    var id = req.params.id;

    if (id) {
        Category.findById(id, function(err, cate) {
            res.render("admin/editCategory", {
                title: "movieDB - 修改分类",
                category: cate
            });
        })
    }
};
