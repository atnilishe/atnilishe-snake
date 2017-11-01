var method = Game.prototype;

var Snake = require("./snake.js");
var Food = require("./food.js");

function Game() {
    this.sizeX = 40;
    this.sizeY = 30;
    this.players = {};
    this.foods = new Array(0);
}

method.getGameState = function() {
    var state = {};
    state.players = this.players;
    state.foods = this.foods;
    return state;
};

method.addPlayer = function(playerId, playerInfo) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    var x = Math.floor(Math.random() * (this.sizeX - 1)) + 1;
    var y = Math.floor(Math.random() * (this.sizeY - 1)) + 1;
    console.log('PLAYER - add x:' + x + 'y:' + y);

    this.players[playerId] = new Snake(x, y, color, playerInfo);
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
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    var x = Math.floor(Math.random() * (this.sizeX - 1)) + 1;
    var y = Math.floor(Math.random() * (this.sizeY - 1)) + 1;
    console.log('FOOD - add x:' + x + 'y:' + y);

    this.foods.push(new Food(x, y, color));
};

module.exports = Game;