var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
ws.onmessage = function (event) {
  console.log(JSON.parse(event.data));
};

