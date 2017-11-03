// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var bodyParser = require('body-parser');
var app = express();

var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});

var sharedsession = require("express-socket.io-session");

var server = http.Server(app);
var io = socketIO(server);
var port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({    extended: true   }));

app.use(session);
io.use(sharedsession(session, {
    autoSave:true
}));

app.set('port', port);
app.use('/client', express.static(__dirname + '/client'));

// Маршруты
app.get('/', function(req, response) {
    response.sendFile(path.join(__dirname, 'auth.html'));
});

app.get('/game', function(req, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/players', function(req, res) {
    var url = 'http://ulogin.ru/token.php?token=' + req.body.token + '&host=' + 'localhost';
    var response = res;
    http.get(url, (res) => {
          res.on('data', (d) => {
                // TODO: create user data
                req.session.userData = JSON.parse(new Buffer(d).toString());
                req.session.save();                 
                response.writeHead(302, {
                    'Location': '/game'
                  });
                response.end();
          });  
        }).on('error', (e) => {
          console.error(e);
    });
  });

// Запуск сервера
server.listen(port, function() {
    console.log('Listening on ' + port);
});

var Game = require("./server/game.js");
var game_angine = new Game();
game_angine.addFood();

io.on('connection', function(socket) {
    // TODO: не пускать уже играющих игроков
    var user = socket.handshake.session.userData;
    if(user == undefined)
        {
            // TODO : redirect to / for auth
            socket.disconnect();
        }
    socket.on('new player', function() {
        try {
            var user = socket.handshake.session.userData;
            playerInfo = {};
            playerInfo.name = user.first_name + ' ' + user.last_name;
            playerInfo.uid = user.uid;
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