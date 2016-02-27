var neurosky = require('node-neurosky');
var WebSocketServer = require('ws').Server;

var client = neurosky.createClient({
	appName:'NodeNeuroSky',
	appKey:'ad'
})

	var starttime = Date.now()/1000;
	var blinkcapture =[];
	var blinkcount = 0;

// bind receive data event
client.on('data',function(data){
	// if websocket server is running
	if(wss){
		// broadcast this latest data packet to all connected clients
		wss.broadcast(data);
	}

	if(data.blinkStrength !=null){
		console.log(data);
		blinkcount =blinkcount +1;

		var curtime = Date.now()/1000;
		var elapsetime = (curtime- starttime);
		blinkcapture.push({'elapsetime':elapsetime.toFixed(1)});
		console.log(blinkcapture.slice(1).slice(-5));

		var len = blinkcapture.length
		if (len>5){
			var difference = parseFloat(blinkcapture[len-1]['elapsetime'])-parseFloat(blinkcapture[len-5]['elapsetime']);
			console.log("5sec blink lapse time " + difference.toFixed(1));


			blinkcapture = blinkcapture.slice(1).slice(-6);
		}


	}
	
	if (data.eSense != null){
		//console.log(data.eSense);
	}

	if (data.eegPower != null){
		
	}


});
// initiate connection
client.connect();
/** END connect to neurosky **/

/** BEGIN start our websocket server **/
// start websocket server to broadcast
var wss = new WebSocketServer({port: 8080});

// broadcast function (broadcasts message to all clients)
wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(JSON.stringify(data));
};

// bind each connection
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('[CLIENT] %s', message);
    });
    ws.send('You are connected to Mindwave Mobile');
});
