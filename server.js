
// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

// Config Server
var $this = this;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Game Management
var objGames = [];
var objSockets = [];

/**
 * WebSite Routing
 */
app.get('/', function(req, res){
  res.sendFile(__dirname + '/html/console.html');
});

app.get('/lobby', function(req, res){
  res.send('{WAITING_FOR_JOINS}');
});

app.post('/create', function(req, res){
  var objGame = JSON.parse(req.body);
  $this.objGames.push(objGame);

  // TODO: Add Chanell to All Sockets

  res.send('Created');
});


/**
 * WebSocket Handling
 */
 io.on('connection', function(socket){
   // TODO: Add To socket Array
   console.log('a user connected');

   socket.on('disconnect', function(){
     console.log('user disconnected');
   });

   // todo: 12345 is the Chanell ID
   // todo this is new in Create Post Routine or in externall Function routine
   socket.on('12345', function(msg){
     console.log(msg);
     io.emit('12345', msg);
   });
 });

/**
 * Run Server
 */
server.listen(3000, function(){
  console.log('HTTP listening on :3000');
});
