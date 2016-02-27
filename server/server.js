var neurosky = require('node-neurosky');
var WebSocketServer = require('ws').Server;

var client = neurosky.createClient({
	appName:'NodeNeuroSky',
	appKey:'ad'
})

	var starttime = Date.now()/1000;
	var blinkcapture =[];
	var blink_lapse = 0;

	var lastblinked = Date.now()/1000;;

console.log("wait 5 seconds, then blink 5 times to initialize stats");

// bind receive data event
client.on('data',function(data){
	// if websocket server is running
	if(wss){
		// broadcast this latest data packet to all connected clients
		wss.broadcast(data);
	}

	//The average person blinks some 15-20 times per minute, or every 3 second 
	//if detect blinking get the time lapse of blinks
	if(data.blinkStrength !=null){
		//console.log(data);
		lastblinked = Date.now()/1000;

		var curtime = Date.now()/1000;
		var elapsetime = (curtime- starttime).toFixed(1);
		blinkcapture.push({'elapsetime':elapsetime});
		//console.log(blinkcapture.slice(1).slice(-5));   // print last 5 second 

		var len = blinkcapture.length
		if (len>5){
			blink_lapse = ((parseFloat(blinkcapture[len-1]['elapsetime'])-parseFloat(blinkcapture[len-5]['elapsetime']))/5).toFixed(1);
			console.log("avg sec/blink: " + blink_lapse);
			blinkcapture = blinkcapture.slice(-5); // cut out old data
		}


	}
	
	//if not blink a long time and detecting high meditation, then you might be sleeping
	if (data.eSense != null){
		//console.log(data.eSense);
		//console.log(data.eSense['meditation']);

		//console.log(lastblinked);

		var curtime = Date.now()/1000;
		var timelapse_blinked = (curtime- lastblinked).toFixed(1);
		//console.log(timelapse_blinked);
		var brain_activity = 100 - parseFloat(data.eSense['meditation']);
		//console.log(brain_activity);

		if (brain_activity<10 && ( blink_lapse > 5 || timelapse_blinked>30) ){
			console.log("wake uppppppppp!!!!!" );
			console.log("last blinked: " + timelapse_blinked + 
						"| average blink lapse: "  + blink_lapse +
						"| brain activity: " + brain_activity);
		}
	}

	// using egg data
	if (data.eegPower != null){
		//console.log(data.eegPower);
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
