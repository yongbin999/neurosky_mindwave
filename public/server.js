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

	//if not blink a long time and detecting high meditation, then you might be sleeping
	//The average person blinks some 15-20 times per minute, or every 3 second 
	//if detect blinking get the time lapse of blinks
	if(data.blinkStrength !=null){
		lastblinked = Date.now()/1000;

		var curtime = Date.now()/1000;
		var elapsetime = (curtime- starttime).toFixed(1);
		blinkcapture.push({'elapsetime':elapsetime});

		var len = blinkcapture.length
		if (len>5){
			blink_lapse = ((parseFloat(blinkcapture[len-1]['elapsetime'])-parseFloat(blinkcapture[len-5]['elapsetime']))/5).toFixed(1);
			
		var curtime = Date.now()/1000;
		var pretime = elapsetime;
		var timelapse_blinked = (curtime- elapsetime)toFixed(1);
		console.log("avg sec/blink: \t" + blink_lapse + "\t\t\t\tlast blinked: " +timelapse_blinked);
			blinkcapture = blinkcapture.slice(1).slice(-6); // cut out old data
		}


	}
	
		if (data.eSense != null){

		//console.log(data.eSense);
		//console.log(data.eSense['meditation']);

		//console.log(lastblinked);

		var curtime = Date.now()/1000;
		var timelapse_blinked = (curtime- lastblinked).toFixed(1);
		//console.log(timelapse_blinked);
		var brain_activity = 100 - parseFloat(data.eSense['meditation']);
		if (brain_activity !=100){

		console.log("\t\t\tbrain activity:\t"+ brain_activity);
		}
		else{

		console.log("\t\t\tbad signal");
		}


		//true ||
		if (brain_activity<30 && ( blink_lapse > 3 || timelapse_blinked>10) ){
			console.log("wake uppppppppp!!!!!" );
			console.log("last blinked: " + timelapse_blinked + 
						"| average blink lapse: "  + blink_lapse +
						"| brain activity: " + brain_activity);



						var five = require("johnny-five"),
						  board = new five.Board({repl:false});

						  board.on("ready", function() {

						  	  var ledPins = [0,1,2,3,4,5,6,7,8,9,10,11,12];
					  var leds = new five.Leds(ledPins);

					  function oneAfterAnother() {
					    var delay = 1;
					    board.counter = 0;
					    for (var i = 0; i < leds.length; i++) {
					      var led = leds[i];

					      board.wait(delay,function(){
					        //console.log(this.counter + " on")
					        leds[this.counter].on();
					      })
					      board.wait(delay +200,function(){
					        //console.log(this.counter + " off")
					        leds[this.counter].off();
					        this.counter = (this.counter + 1) % leds.length;
					      })
					      delay += 300;
					    }
					  }

					   //leds.on();
					  // board.wait(1000, leds.off.bind(leds));

					  oneAfterAnother();
					  board.loop(500, oneAfterAnother);




						  // Creates a piezo object and defines the pin to be used for the signal
						  var piezo = new five.Piezo(13);

						  // Injects the piezo into the repl

						  // Plays a song
						  piezo.play({
						    // song is composed by an array of pairs of notes and beats
						    // The first argument is the note (null means "no note")
						    // The second argument is the length of time (beat) of the note (or non-note)
						    song: [
						      ["C4", 1 / 4],
						      ["D4", 1 / 4],
						      ["F4", 1 / 4],
						      ["D4", 1 / 4],
						      ["A4", 1 / 4],
						      [null, 1 / 4],
						      ["A4", 1],
						      ["G4", 1],
						      [null, 1 / 2],
						      ["C4", 1 / 4],
						      ["D4", 1 / 4],
						      ["F4", 1 / 4],
						      ["D4", 1 / 4],
						      ["G4", 1 / 4],
						      [null, 1 / 4],
						      ["G4", 1],
						      ["F4", 1],
						      [null, 1 / 2]
						    ],
						    tempo: 100
						  });

						  // Plays the same song with a string representation
						  piezo.play({
						    // song is composed by a string of notes
						    // a default beat is set, and the default octave is used
						    // any invalid note is read as "no note"
						    song: "C D F D A - A A A A G G G G - - C D F D G - G G G G F F F F - -",
						    beats: 1 / 4,
						    tempo: 100
						  });

						});
						
						board.on("close", function () {
						console.log('Board closed')
						})

						board.stop();







		}
	}

	// using egg data
	if (data.eegPower != null){
		//console.log(data.eegPower);
		//console.log(data.eegPower.highalpha ?? ); // mentor said this is more useful
		//idea is to get 3 dimension per sensor. (avg,speed,acceleration)
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
