var express = require("express");
var request = require("request");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
   res.render("home");
});

app.get("/results", function(req, res){
   var key = req.query.item;
   var url = "http://www.omdbapi.com/?s=" + key;
   request(url, function(error, response, body){
      if(error){
         console.log("Something went wrong!")
      }
      else {
         if(response.statusCode == 200)
         {
            console.log("Request from API for "+ key +" is successful!");
            var bodyParsed = JSON.parse(body);
            res.render("results", {data: bodyParsed});
         }
      }
   });
});

app.get("/*", function(req, res){
   res.send("No matching extensions found. What are you doing with your life?");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up and running...");
});