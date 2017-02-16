var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
var friends = [
        "Jay", "Akshay", "Vijay", "Ishan"
        ];

app.get("/", function(request, response){
   response.send("Hi there, welcome to my assignment");
   console.log("Someone requested: /");
});

app.get("/speak/:namex", function(req, res){
   var name = req.params.namex;
   var says = "Woof Woof";
    if (name=="pig")
        says = "Oink";
    if (name=="cow")
        says = "Moo";
    if (name=="dog")
        says = "Woof Woof";
    console.log("The " + name + " says '"+ says+"'");
    res.send("The " + name + " says '"+ says+"'");
});

app.get("/repeat/:namex/:numberx", function(req, res){
   var name = req.params.namex;
   var numb =req.params.numberx;
   var n = Number(numb);
   var str = name.concat(" ");
   console.log(name + " " + numb);
   for (var i=1;i<n;i++)
   {
      str =  str.concat(name);
      str = str.concat(" ");
   }
   console.log(str);
   res.send(str);
});

app.get("/dog", function(req, res){
   res.send("Hello or Bow Wow"); 
});

app.get("/cat", function(req, res){
   res.send("Hello or Meow"); 
});

// Now on, creation on ejs starts
app.get("/ejs/:thing", function(req, res){
    var thing = req.params.thing;
   res.render("thing.ejs", {theThing: thing}); 
});

app.get("/ejsStuff/:namex", function(req, res){
   var name = req.params.namex;
   res.render("stuff.ejs", {theName: name}); 
});

app.get("/ejsloop", function(req, res){
    var postMan = [
        { name: "Jay", sname: "Sinha"},
        { name: "Akshay", sname: "Srivastava"},
        { name: "Vijay", sname: "Shah"}
    ];
   res.render("looper.ejs", {thePost: postMan}); 
});

app.get("/friends", function(req, res){
   res.render("friends", {friendsList: friends});
});

app.post("/addFriend", function(req, res){
   var name = req.body.friendName;
   friends.push(name);
   res.redirect("/friends");
});

app.get("/*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life ?");    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started. Listening on the suggested cloud9 Port");
});
