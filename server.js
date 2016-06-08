var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var router = express.Router();
var path = require('path');
var pubsub = require('./pubsub');

//provision the database
var mongoose = require ("mongoose"); // The reason for this demo.
var mongoURI = 'localhost:27017/node_template';
var uristring = process.env.MONGODB_URI || mongoURI;
mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);} 
      else {
      console.log ('Succeeded connected to: ' + uristring);}
});




//routing static index page
app.use(express.static(__dirname + "/"))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});



//start server
var server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);


//creates websocket server
var wss = new WebSocketServer({server: server});
console.log("websocket server created");

wss.on("connection", function(ws) {

	//set timer to send the date every second
	var id = setInterval(function() {
	 	ws.send(JSON.stringify(Date.now()), function() {  })
	}, 1000);


	var unique_id = console.log(ws.upgradeReq.headers['sec-websocket-key']);
	ws.send(unique_id);
	//confirm the connection is ooen from the server
  	console.log("websocket connection open");

  	ws.on('message', function(msg){


  		console.log('server received msg from client');
  		console.log(msg);

  	});

  	//when close connection, remove the set interval
 	ws.on("close", function() {
    	console.log("websocket %s connection close", ws);
    	clearInterval(id);
  	});



});






