var mongoose = require("mongoose");

var commentsModel = mongoose.Schema({
   text: String,
   author: String
});

module.exports = mongoose.model("Comments", commentsModel);