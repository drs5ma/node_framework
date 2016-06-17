

var host = location.origin.replace(/^http/, 'ws')
var connection = new WebSocket(host);



connection.onerror = function (error){

	//console.error('Websocket error '+error);
};

connection.onopen = function(){

	//console.log("client: on open");



};

		
connection.sendposition = function(x,y){



}



connection.onmessage = function (event) {
	if(event.data!=""){
		var json = JSON.parse(event.data);



		if(json['msg']=='server_timestamp'){
			var m = new bigfire();
			m.init(parseFloat(json.x), parseFloat(json.y));
		}



		if(json['msg']==''){

			
		}






	}
};


connection.sendmessage = function(event){

	//var out = "sent message: "+JSON.parse(event);
	//console.log(out);
	//connection.send(JSON.stringify( event ));

};


