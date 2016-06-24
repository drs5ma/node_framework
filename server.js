var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var router = express.Router();
var path = require('path');

function Player(){}
Player.prototype = {
    init: function(x,y,id){
      this.x = x;
      this.y = y;
      this.id = id;
      this.current_anims = [];
      this.speed = 0.15;
    }
}

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

wss.broadcast = function broadcast(d) {
  wss.clients.forEach(function each(client) {
    client.send(d);
  });
};

var id = setInterval(function() {
      var data = JSON.stringify({ type: 'indirect_response', 
                              msg: 'server_timestamp', 
                              data: Date.now(),
                              x: Math.random()*500,
                              y: Math.random()*500});
      wss.broadcast(data);
}, 250);


var Clients = {};

// {id: Player(), id: Player()}

wss.on("connection", function(ws) {
  //confirm the connection is open from the server
  console.log("websocket connection open");
	var unique_id = ws.upgradeReq.headers['sec-websocket-key'];

	ws.send(JSON.stringify({'msg':'assign_id', 'id':unique_id}));
  ws.send(JSON.stringify({'msg':'send_userlist', 'userlist':JSON.stringify(Clients)}));

  var newjoin = new Player();
  var x = Math.random()*1000 - 500.0;
  var y= Math.random()*1000 - 500;

  console.log(x,y);
  newjoin.init(x,y,unique_id);
  Clients[unique_id] = newjoin;

  wss.broadcast(JSON.stringify({'msg':'client_join', 'client_obj':JSON.stringify(newjoin)}));

  ws.on('message', function(data){
    var json = JSON.parse(data);
    var msg = json['msg'];
  	console.log('server received msg from client');
  	console.log(msg);
    if(msg=='client_move'){
        console.log('client move');
    }
  });


  	//when close connection, remove the set interval
 	ws.on("close", function() {
    	console.log("websocket %s connection close", ws);
      //remove client from list
      Clients[unique_id] = null;
      delete Clients[unique_id];
      //broadcast the loss;
      wss.broadcast(JSON.stringify({'msg':'broadcast_leave', id: unique_id}));
  });



});






