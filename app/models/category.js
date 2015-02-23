var mongoose = require("mongoose");
var CategorySchema = require("../schemas/category");
var Category = mongoose.model("Category", CategorySchema);    // 这里就相当于给Mongodb的Collection命名

module.exports = Category;