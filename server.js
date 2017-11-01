// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var port = process.env.PORT || 5000;

app.set('port', port);
app.use('/client', express.static(__dirname + '/client'));

// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});


// DATABASE
// ===============================================

var Datastore = require('nedb');

var db = new Datastore({
      filename: 'players.db', 
      autoload: true,
      timestampData: true
});

// ===============================================


// Запуск сервера
server.listen(port, function() {
    console.log('Listening on ' + port);
});

var Game = require("./server/game.js");
var game_angine = new Game();
game_angine.addFood();

io.on('connection', function(socket) {
    socket.on('new player', function(playerInfo) {
        try {
            db.findOne({name: playerInfo.name},{}, function(err, player) {
                if (err) console.log(err);
                if(player)
                {
                    console.log('Finde player: ' + playerInfo.name);
                    playerInfo.length = player.length;
                }
                else
                {
                    console.log('Add player: ' + playerInfo.name);
                    var Nplayer = {
                        name: playerInfo.name,
                        length: 0
                      };
                      
                      db.insert(Nplayer, function(err, newPlayer) {
                        if (err) console.log(err);
                        console.log(newPlayer);
                      });
                }
                game_angine.addPlayer(socket.id, playerInfo);
                io.sockets.emit('state', game_angine.getGameState());
              });       
        } catch (error) {
            console.log('Error on new player' + error.name + ":" + error.message + "\n" + error.stack);
        }
    });
    socket.on('movement', function(data) {
        try {
            game_angine.processMovement(data, socket.id);
            io.sockets.emit('state', game_angine.getGameState());
        } catch (error) {
            console.log('Error on movement' + error.name + ":" + error.message + "\n" + error.stack);
        }
    });
    socket.on('disconnect', function() {
        try {
            game_angine.deletePlayer(socket.id);
            io.sockets.emit('state', game_angine.getGameState());
        } catch (error) {
            console.log('Error on disconnect' + error.name + ":" + error.message + "\n" + error.stack);
        }
    });
});