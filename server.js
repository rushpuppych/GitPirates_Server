
// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

/**
 * WebSite Routing
 */
app.get('/', function(req, res){
  res.sendFile(__dirname + '/html/console.html');
});

app.get('/lobby', function(req, res){
  res.send('{WAITING_FOR_JOINS}');
});

app.get('/board', function(req, res){
  res.send('{SCORE_BOARD}');
});

app.post('/create', function(req, res){
  res.send('{CREATING OWN GAME}');
});


/**
 * WebSocket Handling
 */
 io.on('connection', function(socket){
   console.log('a user connected');

   socket.on('disconnect', function(){
     console.log('user disconnected');
   });

   // todo: 12345 is the Chanell ID
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
