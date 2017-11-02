var method = Game.prototype;

var PlayersRepository = require("./playersRepository.js");
var Snake = require("./snake.js");
var Food = require("./food.js");

function Game() {
    this.sizeX = 40;
    this.sizeY = 30;
    this.players = {};
    this.foods = new Array(0);
    this.playersRepository = new PlayersRepository();
}

method.getGameState = function() {
    var state = {};
    state.players = this.players;
    state.foods = this.foods;
    return state;
};

method.GetRandomPoint = function(){
    var point = {};
    var letters = '0123456789ABCDEF';
    point.color = '#';
    for (var i = 0; i < 6; i++) {
        point.color += letters[Math.floor(Math.random() * 16)];
    }

    point.x = Math.floor(Math.random() * (this.sizeX - 1)) + 1;
    point.y = Math.floor(Math.random() * (this.sizeY - 1)) + 1;

    return point;
}

method.addPlayer = function(playerId, playerInfo, callback) {
    var game = this;
    this.playersRepository.findPlayerByName(playerInfo.name,function(player) {
        if(player){
            playerInfo.length = player.length;
        }
        else{
            var newPlayer = {
                name:playerInfo.name,
                length:0
            };
            game.playersRepository.createPlayer(newPlayer);
        }
        var point = game.GetRandomPoint();
        game.players[playerId] = new Snake(point.x, point.y, point.color, playerInfo);
        callback();
    });
};

method.deletePlayer = function(playerId) {
    delete this.players[playerId];
};

method.processMovement = function(movement, playerId) {
    var player = this.players[playerId] || {}
    player.prototype = Snake.prototype;

    if (this.isMapWall(movement, player) == false && this.isPlayer(movement, player) == false) {
        player.movePlayer(movement);
    }

    // is food
    this.foods.forEach(function(item, index, array) {
        if (item.x === player.body[0].x && item.y === player.body[0].y) {
            this.foods.splice(index, 1);
            player.addTail();
            this.playersRepository.updatePlayer(player);
            this.addFood();
        }
    }, this);
};

method.isMapWall = function(movement, player) {
    return (
        (movement.up && player.body[0].y == 1) ||
        (movement.down && player.body[0].y == this.sizeY - 1) ||
        (movement.left && player.body[0].x == 1) ||
        (movement.right && player.body[0].x == this.sizeX - 1)
    );
};

method.isPlayer = function(movement, player) {
    for (var playerId in this.players) {
        var mplayer = this.players[playerId];
        if (player === mplayer) continue;
        for (var i = 0; i <= mplayer.body.length; i++) {
            var body = mplayer.body[i];
            if (
                (movement.up && (player.body[0].y - 1) == body.y && player.body[0].x == body.x) ||
                (movement.down && (player.body[0].y + 1) == body.y && player.body[0].x == body.x) ||
                (movement.left && (player.body[0].x - 1) == body.x && player.body[0].y == body.y) ||
                (movement.right && (player.body[0].x + 1) == body.x && player.body[0].y == body.y)
            ) {
                return true;
            }
        }
    }
    return false;
};

method.addFood = function() {
    var point = this.GetRandomPoint();
    this.foods.push(new Food(point.x, point.y, point.color));
};

module.exports = Game;