var express = require("express")
var bodyParser = require('body-parser')
var path = require("path")
var mongoose = require("mongoose")
var _ = require("underscore")
var Movie = require("./models/movie")
var port = process.env.PORT || 3000
var app = express()

mongoose.connect("mongodb://localhost/imooc")

app.set("views","./views/pages")
app.set("view engine","jade")
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,"bower_components")))
app.listen(port)

console.log("imooc started on port " + port)

//路由
//index page 
app.get("/",function(req,res){
	Movie.fetch(function(err,movies){
		if(err)
			console.log(err)

		res.render("index",{
			title:"imooc 首页",
			movies:movies
		})
	})
})
//detial page 
app.get("/movie/:id",function(req,res){
	var id = req.params.id
	console.log(id)
	Movie.findById(id,function (err,movie) {

		res.render("detial",{
			title:"imooc " + movie.title,
			movie: movie
		})
	})
})
// admin update movie
app.get("/admin/update/:id",function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title: 'imooc 后台更新页',
				movie: movie
			})
		})
	}
})
// admin post movie
app.post("/admin/movie/new",function(req,res){
	var movieObj = req.body.movie
	var id = movieObj._id
	var _movie = new Movie({})
	// console.log(movieObj)
	// console.log(id)
	if(id !== "undefined"){
		Movie.findById(id,function(err,movie){
			if(err)
				console.log(err)

			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err)
					console.log(err)
				res.redirect("/movie/" + movie._id)
			})
		})
	}else{
		_movie = new Movie({
			title: movieObj.title,
			doctor: movieObj.doctor,
			country: movieObj.country,
			languaue: movieObj.languaue,
			poster: movieObj.poster,
			flash: movieObj.flash,
			year: movieObj.year,
			summary: movieObj.summary
		})

		_movie.save(function(err,movie){
			if(err)
				console.log(err)
			// console.log(movie)
			res.redirect("/movie/" + movie._id)
		})
	}
})
//list page 
app.get("/admin/list",function(req,res){
	Movie.fetch(function(err,movies){
		if(err)
			console.log(err)

		res.render("list",{
			title:"imooc 列表页",
			movies:movies
		})
	})
})
//admin page 
app.get("/admin/movie",function(req,res){
	res.render("admin",{
		title:"imooc 后台录入页",
		movie: {
			title:"",
			doctor:"",
			country:"",
			year:"",
			poster:"",
			flash:"",
			languaue:"",
			summary:""
		}
	})
})
