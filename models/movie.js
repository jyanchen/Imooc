var mongoose = require("mongoose")
var MoviewSchema = require("../schemas/movie")
var Movie = mongoose.model("Movie",MoviewSchema)

module.exports = Movie