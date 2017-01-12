const dgram = require('dgram');
const server = dgram.createSocket('udp4');

var connected = [];
var numPlayers = 2;

server.on('message', function (msg, info) {
	connected.push({address: info.address, port: info.port});

	if (connected.length == numPlayers) {
		console.log("Matching up " + numPlayers + " people");
		for (var i = 0; i < numPlayers; i++) {
			var arr = [];
			for (var j = 0; j < numPlayers; j++) {
				if (j != i) {
					arr.push(connected[j]);
				}
			}
			server.send(JSON.stringify({id: i, host: i == 0, peers: arr}), connected[i].port, connected[i].address);
		}
		connected = [];
	}
});

server.bind(3000);
