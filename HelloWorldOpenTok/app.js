// Dependencies
var express = require('express'),
    OpenTok = require('opentok');

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/helloopentok");

var sessionSchema = mongoose.Schema({
   sessionID: String 
});

// Verify that the API Key and API Secret are defined
var apiKey = 45805602,
    apiSecret = "b8bf9cafcad900da2c2d23eed5882b4fff91837e";
if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

// Initialize the express app
var app = express();
app.use(express.static(__dirname + '/public'));

// Initialize OpenTok
var opentok = new OpenTok(apiKey, apiSecret);

// Create a session and store it in the express app
opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  // We will wait on starting the app until this is done
  init();
});

app.get('/', function(req, res) {
  var sessionId = app.get('sessionId'),
      // generate a fresh token for this client
      token = opentok.generateToken(sessionId);

  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token
  });
});

// Start the express app
function init() {
  app.listen(process.env.PORT, process.env.IP, function(req, res) {
    console.log('You\'re app is now ready');
  });
}