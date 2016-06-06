var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

var router = express.Router();
var path = require('path');


var mongoose = require ("mongoose"); // The reason for this demo.
var mongoURI = 'localhost:27017/node-ws-test';
var uristring = process.env.MONGODB_URI || mongoURI;
mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);} 
      else {
      console.log ('Succeeded connected to: ' + uristring);}
});


//routing
app.use(express.static(__dirname + "/"))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//start server
var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})

