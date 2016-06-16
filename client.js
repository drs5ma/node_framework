

var host = location.origin.replace(/^http/, 'ws')
var connection = new WebSocket(host);



connection.onerror = function (error){

	//console.error('Websocket error '+error);
};

connection.onopen = function(){

	//console.log("client: on open");

}

connection.onmessage = function (event) {
	//console.log("client received dataa from server:");
	//console.log(event.data);
	//var obj = JSON.parse(event.data);

	//console.log(obj);
	//var out = "message received: "+JSON.parse(event);
	//console.log(out);

};


connection.sendmessage = function(event){

	//var out = "sent message: "+JSON.parse(event);
	//console.log(out);
	//connection.send(JSON.stringify( event ));

};


