var mongoose = require("mongoose");
var UserwSchema = require("../schemas/user");
var User = mongoose.model("User", UserwSchema);

module.exports = User;