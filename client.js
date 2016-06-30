var host = location.origin.replace(/^http/, 'ws')
var connection = new WebSocket(host);

// function Player(){}
// Player.prototype = {
//     init: function(x,y,id){
//       this.x = x;
//       this.y = y;
//       this.id = id;
//       this.current_anims = [];
//       this.svgobj = null;
//       this.speed = 0.15;
//     }
// }

var my_id;
var me_obj;
var clients = {};
var current_fires = [];
var flag = false;
var passdata;

var messagebus = [];

connection.onerror = function (error){
	console.error('Websocket error '+error);
};

connection.onopen = function(){
	console.log("client: on open");
};

		
connection.sendanimation = function(event){

	connection.send(JSON.stringify( event ));
	//event = { 'msg':'client_move' ,
				// 'id':12342342,
				// 'time' : 1.24,
				// 'transform': 't124 242'
				// 'easing': 'linear'}
};
connection.sendbbox = function(bbox){

	var json = {'msg':'client_bbox', id: my_id,'bbox': JSON.stringify(bbox)};
	connection.send(JSON.stringify( json ));

}

connection.sendmessage = function(event){
	//var out = "sent message: "+JSON.parse(event);
	//console.log(out);
	connection.send(JSON.stringify( event ));
};

connection.onmessage = function (event) {
	if(event.data!=""){
		var json = JSON.parse(event.data);
		var msg = json['msg'];

		if(msg=='server_timestamp'){
		 	messagebus.push(json);
		}
		else if(msg=='send_userlist'){
			clients = JSON.parse(json['userlist']);
			for(var key in clients){

				clients[key]['svgobj'] = paper.circle(0,0,24).transform('t'+clients[key].x+' '+clients[key].y);
				// clients[key]['svgobj'] = paper.circle(clients[key].x,clients[key].y,24);
			}
		}
		else if(msg=='client_join'){

			var person = JSON.parse(json['client_obj']);
			if(true){//person.id != my_id){//dont add self to clients list
				clients[person.id] = person;
				console.log(person);
				var mestring =   't'+person.x+' '+person.y;
				clients[person.id]['svgobj'] = paper.circle(0,0,24).transform( mestring );
				if(person.id == my_id){
				setview();}
			}
		}
		else if(msg=='client_move'){
			var id = json['id'];
			var time = json['time'];
			var transform = json['transform'];
			var easing = json['easing'];
			clients[id]['svgobj'].animate( { transform: transform } ,time, mina[easing]); 
			//animate player
		}
		else if(msg=='broadcast_leave'){
			clients[json['id']]['svgobj'].remove();
			clients[json['id']] = null;
			delete clients[json['id']]
			// remove player
		}
		else if(msg=='client_clickfire'){
			var newf = new bigfire();
			newf.init(json['pos'][0], json['pos'][1]);
			current_fires.push(newf);
			messagebus.push({'msg':'firewaiting'});
		}
		else if(msg =='assign_id'){
			my_id = json['id'];
		}
		else{
			console.log('unsupported msg type');
		}





	}
};



