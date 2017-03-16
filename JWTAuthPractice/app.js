var express = require("express");
var app = express();
var User = require("./models/user");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var morgan = require("morgan");

//Connection to Database
mongoose.connect("mongodb://localhost/jwtauth");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));


function middle(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, "This is a secret", function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
}
// app.use(apiRoute);

app.post("/authenticate", function(req, res){
   User.findOne({username: req.body.name}, function(err, foundUser){
      if (err) {
          console.log(err);
          res.json({success: false, message: 'User not found!'});
      } else {
          if (!foundUser) {
              res.json({success: false, message: 'User is not found!'});
          } else {
              if (String(foundUser.password) !== String(req.body.password)) {
                  res.json({success: false, message: 'Authentication failed. Password does not match!'});
              } else {
                var token = jwt.sign(foundUser, "This is a secret", {
                    expiresIn: 1440 // expires in 24 hours
                });
                var enable;
                if (foundUser.admin === true) {
                    enable = true;
                } else {
                    enable = false;
                }
                  res.json({
                      success: true,
                      message: "Enjoy your token!",
                      token: token,
                      enable: enable
                  });
              }
          }
      }
   });
});


app.get("/api", middle, function(req, res){
   res.send("Hello, I am a temporary route soon to be configured!"); 
});

app.get("/users", middle, function(req, res){
   User.find({}, function(err, usersList){
      if (err) {
          res.json({success: false, message: "Some error with database occured!"});
      } else {
          res.json(usersList);
      }
   });
});

app.get("/setup", function(req, res){
   var jay = User({
       username: 'Jay',
       password: 'password',
       admin: true
   });
   
   User.create(jay, function(err, newUser){
      if(err)
      {
          res.send("There was some error!");
      } else {
          res.send("Successfully created user");
      }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up and running!"); 
});