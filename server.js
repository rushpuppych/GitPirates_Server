
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
this.objGames = [];

/**
 * WebSite Routing
 */
app.get('/', function(req, res){
  res.sendFile(__dirname + '/html/console.html');
});

app.get('/lobby', function(req, res){
  res.send(JSON.stringify($this.objGames));
});

app.get('/game/:id', function(req, res){
  for(var numIndex in $this.objGames) {
    if($this.objGames[numIndex]['id'] == req.params.id) {
      res.send(JSON.stringify($this.objGames[numIndex]));
    }
  }
});

app.post('/create', function(req, res){
  var numMapId = req.body.id
  $this.objGames.push(req.body);
  res.send('Created');
});


/**
 * WebSocket Handling
 */
 io.on('connection', function(socket){
   // Player Connect
   socket.emit('connect', {});

   // Player Disconnected
   socket.on('disconnect', function(){
     // Delete Player from Game
     for(var numGameIndex in $this.objGames) {
       if($this.objGames[numGameIndex]['id'] == socket.mission_id) {
         for(var numIndex in $this.objGames[numGameIndex]['connected']) {
           if($this.objGames[numGameIndex]['connected'][numIndex]['id'] == socket.player_id) {
             delete $this.objGames[numGameIndex]['connected'][numIndex];
           }
         }
       }
     }
     console.log("Disconnected: " + socket.player_id);
   });

   // Player Server Event
   socket.on('server', function(objMsg){
     if(objMsg.type == 'connect') {
       socket.player_id = objMsg.player_id;
       socket.mission_id = objMsg.mission_id;

       // Mission Broadcasting
       socket.on(socket.mission_id, function(objMsg){
         io.emit(socket.mission_id, objMsg);
       });

       // Add Player to Game
       for(var numGameIndex in $this.objGames) {
         if($this.objGames[numGameIndex]['id'] == socket.mission_id) {
           $this.objGames[numGameIndex]['connected'].push({id: socket.player_id, player: objMsg.player});
           io.emit(socket.mission_id, {type: 'player_connected'});
         }
       }
       console.log("Connected: " + socket.player_id);
     }

   });
 });

/**
 * Run Server
 */
server.listen(3000, function(){
  console.log('HTTP listening on :3000');
});
