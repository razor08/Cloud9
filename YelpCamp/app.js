var express =  require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
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
   res.render("campGrounds", {CGList: campGrounds}); 
});

app.post("/campGrounds/new", function(req, res){
    var newCG = req.body.cgx;
    var imgSrc = req.body.cimg;
    console.log(newCG);
    var x = { name: newCG, img: imgSrc};
    campGrounds.push(x);
    res.redirect("/campGrounds");    
});

app.get("/*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life ?");    
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up and running! Go ahead make your move."); 
});