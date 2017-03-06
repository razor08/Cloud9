var mongoose = require("mongoose");
var Campgrounds = require("./models/campground");
mongoose.connect("mongodb://localhost/blogrestapp/campgrounds");
Campgrounds.create({
  name: "Corcovado National Park",
  image: "https://lovelace-media.imgix.net/uploads/20/ab358ee0-b864-0131-53f8-3e84148635f9.jpg?w=480&h=360&fit=crop&crop=faces&auto=format&q=70&dpr=2",
  desc: "It's a nice park in Costa Rica."
}, function(err, cmpg){
   if (err) {
       console.log(err);
   } else {
       console.log(cmpg);
   }
});
