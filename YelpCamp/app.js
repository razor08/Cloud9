var express =  require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");

app.set(bodyParser.urlencoded({extended: true}));
app.set(express.static("public"));
app.set("view engine", "ejs");

var campGrounds = [ 
    { name: "Yosemite National Park", img: ""},
    { name: "Shenandoah National Park", img: ""},
    { name: "Boya Lake Provincial Park", img: ""},
    { name: "Big Sur", img: ""}
    ];
    
app.get("/", function(req, res){
   res.render("home"); 
});

app.get("/campGrounds", function(req, res){
   app.render("campGrounds", {CGList: campGrounds}); 
});

app.get("/campGrounds/new", function(req, res){
    var newCG = req.query.new;
    var imgSrc = req.query.img;
    var x = { name: newCG, img: imgSrc};
    campGrounds.push(x);
    res.redirect("/campGrounds");    
});

