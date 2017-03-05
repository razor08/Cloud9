var express =  require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitize = require("express-sanitizer");

//Primary Stuff to be included!
mongoose.connect("mongodb://localhost/blogrestapp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressSanitize());
app.use(methodOverride("_method"));

//The definition of the Blog model Schema to be used inside the real app!
var blogSchema = new mongoose.Schema({
    title: String,
    image: String, 
    body: String,
    created: {type: Date, default: Date.now}
});

//Define the var to be used for inserting the JSON objects within the Node Application!
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "data:image/jpeg;base64,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",
//     body: "Hello, this is a blog post"
// });

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        };
    });
});

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err) {
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.render("edit", {blog: foundBlog});
       }
    });
})

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, Blog){
       if(err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs/"+req.params.id);
       }
    });
});

app.delete("/blogs/:id", function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
     if(err){
         res.redirect("/blogs");
     }  else {
         res.redirect("/blogs");
     }
   });
});

app.get("/*", function(req, res){
    res.send("Sorry, page not found...What are you doing with your life ?");    
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up and running! Go ahead make your move."); 
});