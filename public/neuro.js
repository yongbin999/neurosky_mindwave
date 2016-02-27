var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//Lets define a port we want to listen to

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.ejs');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3030, function(){
  console.log('listening on *:3000');
});

var mins = {
  delta: 4000000,
  theta: 4000000,
  loAlpha: 4000000,
  hiAlpha: 4000000,
  loBeta: 4000000,
  hiBeta: 4000000,
  loGamma: 4000000,
  midGamma: 4000000,
};

var maxs = {
  delta: 0,
  theta: 0,
  loAlpha: 0,
  hiAlpha: 0,
  loBeta: 0,
  hiBeta: 0,
  loGamma: 0,
  midGamma: 0,
};

var Cylon = require('cylon');

Cylon.robot({
  connections: {
    neurosky: { adaptor: 'neurosky', port: '/dev/tty.MindWaveMobile-DevA' }
  },

  devices: {
    headset: { driver: 'neurosky' }
  },

  work: function(my) {

    my.headset.on('eeg', function(data){
      findDiffs(data);
      io.emit('series', data);
    });

  }
}).start();

function findDiffs(data){
  var changed = false;
  var minCopy = copyObj(mins);
  var maxCopy = copyObj(maxs);
  for(var props in data){
    if(data[props] !== 0){
      mins[props] = Math.min(data[props], mins[props]);
    }
    maxs[props] = Math.max(data[props], maxs[props]);
  }
  if(isDiff(minCopy, mins)){
    console.log('there was a change');
    console.log('mins', mins);
    changed = true;
  }

  if(isDiff(maxCopy, maxs)){
    console.log('there was a change');
    console.log('maxs', maxs);
    changed = true;
  }

  io.emit('mins', mins);
  io.emit('maxs', maxs);
}

function copyObj(obj){
  var copy = {};
  for(var props in obj){
    copy[props] = obj[props];
  }
  return copy;
}

function isDiff(a, b){
  for(var props in a){
    if(a[props] !== b[props]) { return true; }
  }
  return false;
}
