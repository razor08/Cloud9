var mongoose = require("mongoose");
var user = mongoose.Schema({
   username: String,
   password: String,
   admin: Boolean
});

module.exports = mongoose.model("User", user);