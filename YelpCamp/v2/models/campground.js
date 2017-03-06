var mongoose = require("mongoose");

var campGroundsModel = mongoose.Schema({
   name: String, 
   image: String,
   desc: String,
   comments: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "Comments"
   }]
});

module.exports = mongoose.model("Campground", campGroundsModel);