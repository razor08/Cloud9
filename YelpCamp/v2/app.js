var mongoose = require("mongoose");
var Campgrounds = require("./models/campground");
var Comments = require("./models/comments");
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app =express();
var expressSanitize = require("express-sanitizer");
var campGrounds = [ 
    { name: "Yosemite National Park", img: "https://lovelace-media.imgix.net/uploads/20/2b3a7b30-b600-0131-92da-76123c8e5fa3.jpg?w=480&h=324&fit=crop&crop=faces&auto=format&q=70&dpr=2"},
    { name: "Shenandoah National Park", img: "https://lovelace-media.imgix.net/uploads/20/2c77d6f0-b605-0131-4925-0eb5cee09ce1.jpg?w=480&h=320&fit=crop&crop=faces&auto=format&q=70&dpr=2"},
    { name: "Boya Lake Provincial Park", img: "https://lovelace-media.imgix.net/uploads/20/2c716550-b605-0131-568e-023a6d66c206.jpg?w=480&h=360&fit=crop&crop=faces&auto=format&q=70&dpr=2"},
    { name: "Big Sur", img: "https://lovelace-media.imgix.net/uploads/20/c412ead0-b605-0131-62dd-06fb61bcfb52.jpg?w=480&h=319&fit=crop&crop=faces&auto=format&q=70&dpr=2"}
    ];

mongoose.connect("mongodb://localhost/YelpCamp/v1");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressSanitize());
app.use(methodOverride("_method"));

app.get("/", function(req, res){
   res.render("home", {CGList: campGrounds}); 
});

app.get("/campGrounds", function(req, res){
   res.render("campGrounds", {CGList: campGrounds}); 
});

app.post("/campGrounds/new", function(req, res){
    var newCG = req.body.cgx;
    var imgSrc = req.body.cimg;
    console.log(newCG);
    var x = { name: newCG, img: imgSrc};
    res.redirect("/campGrounds");    
});

app.get("/*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life ?");    
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up and running! Go ahead make your move."); 
});