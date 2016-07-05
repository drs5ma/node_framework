var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var router = express.Router();
var path = require("path");
var backend = require('./backend.js');




function Player(){}
Player.prototype = {
    init: function(x,y,id){
      this.x = x;
      this.y = y;
      this.id = id;
      this.current_anims = [];
      this.speed = 0.15;
      this.bbox = {};
    }
}
function isInside(bbox, point){
      var x = bbox[0];
      var y = bbox[1];
      var width = bbox[2];
      var height = bbox[3];
      if( parseFloat(point[0]) < x || 
        parseFloat(point[1]) < y || 
          parseFloat(point[0]) > x+width || 
            parseFloat(point[1]) > y+height ){
        return false;}
      return true;
}



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
    if (client.readyState == client.OPEN) {
        client.send(d);
    }
  });
};

wss.broadcast_ifinbbox = function broadcast2(d, point) {
  wss.clients.forEach(function each(client) {
    if (client.readyState == client.OPEN) {
      var unique_id = client.upgradeReq.headers['sec-websocket-key'];
      //console.log( Clients[unique_id]['bbox'] , point );
      if(isInside( Clients[unique_id]['bbox'] , point )){
          client.send(d);
      }
    }
  });
};

var id = setInterval(function() {
  var center = {x:0,y:0};
  var radius = 500;
  var randx = center.x+(radius*Math.cos(2*Math.PI*Math.random()));
  var randy = center.y+(radius*Math.sin(2*Math.PI*Math.random()));
  var data = JSON.stringify({ type: 'indirect_response', 
                          msg: 'server_timestamp', 
                          data: Date.now(),
                          x: randx,
                          y: randy
                        });

  wss.broadcast_ifinbbox(data, [randx,randy]);

}, 240);




var Clients = {};
var db_contents = [];


var handle_wss = function(){
  wss.on("connection", function(ws) {
    console.log(db_contents);

    // backend.addElement('redcircle', 
    //   JSON.stringify({fill: 'red', 
    //    transform: 'matrix(1,0,0,1,-45.29,114.66)',
    //    r: '8',
    //    cy: '24',
    //    cx: '24' })
    // );

    //confirm the connection is open from the server
    console.log("websocket connection open");
    var unique_id = ws.upgradeReq.headers['sec-websocket-key'];

    ws.send(JSON.stringify({'msg':'assign_id', 'id':unique_id}));
    ws.send(JSON.stringify({'msg':'send_userlist', 'userlist':JSON.stringify(Clients)}));

    var newjoin = new Player();


    var x = 1000*Math.random() - 500;
    var y = 1000*Math.random() - 500;


    newjoin.init(x,y,unique_id);
    Clients[unique_id] = newjoin;

    wss.broadcast(JSON.stringify({'msg':'client_join', 'client_obj':JSON.stringify(newjoin)}));

    ws.on('message', function(data){
      var json = JSON.parse(data);
      var msg = json['msg'];
      console.log('server received msg from client');
      console.log(msg);
      if(msg=='client_move'){
          //console.log('client move');
          var inter = json['transform'].substring(1).split(' ');
          Clients[json['id']].x = inter[0];
          Clients[json['id']].y = inter[1];
          wss.broadcast(data);
      }
      else if(msg=='client_bbox'){
        console.log(json['bbox']);
        Clients[json['id']].bbox = JSON.parse(json['bbox']);
      }
      else if(msg=='client_clickfire'){
         wss.broadcast_ifinbbox(data, json['pos']);
      }
      else if(msg=='client_mousemove'){
          wss.broadcast(data);
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
}




//load the db before websockets opens
var query = backend.getAll();
query.exec()
  .then(function(docs,err){
                        if(err){return console.log(err);}
                        docs.forEach(function(doc){
                          db_contents.push(doc);
                        });
                        return;
                    })
  .then(handle_wss);




