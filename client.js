

var host = location.origin.replace(/^http/, 'ws')
var connection = new WebSocket(host);



connection.onerror = function (error){

	console.error('Websocket error '+error);
};

connection.onopen = function(){

	console.log("client: on open");

}

connection.onmessage = function (event) {
	//console.log("client received dataa from server:");
	//console.log(event.data);

};

