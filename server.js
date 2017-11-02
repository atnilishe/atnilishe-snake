// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({
    extended: true 
  }));
var server = http.Server(app);
var io = socketIO(server);
var port = process.env.PORT || 5000;

app.set('port', port);
app.use('/client', express.static(__dirname + '/client'));

// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'auth.html'));
});

app.get('/game', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/players', function(req, res) {
    var url = 'http://ulogin.ru/token.php?token=' + req.body.token + '&host=' + 'localhost';

    http.get(url, (res) => {
          res.on('data', (d) => {
            console.log(JSON.parse(new Buffer(d).toString()));
          });
  
        }).on('error', (e) => {
          console.error(e);
    });
      
    //$user['network'] - соц. сеть, через которую авторизовался пользователь
    //$user['identity'] - уникальная строка определяющая конкретного пользователя соц. сети
    //$user['first_name'] - имя пользователя
    //$user['last_name'] - фамилия пользователя

    res.sendFile(path.join(__dirname, 'index.html'));
  });

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
            game_angine.addPlayer(socket.id, playerInfo, function(){                
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