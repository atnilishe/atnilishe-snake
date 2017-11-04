var method = Game.prototype;

Snake = require("./snake.js");
Food = require("./food.js");
User = require("./user.js")

function Game() {
    this.sizeX = 40;
    this.sizeY = 30;
    this.players = {};
    this.foods = new Array(0);
}

method.getGameState = function () {
    var state = {};
    state.players = this.players;
    state.foods = this.foods;
    return state;
};

method.GetRandomPoint = function () {
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

method.addPlayer = function (playerId, player, callback) {
    var game = this;
    User.findById(player.id, function (err, user) {
        var point = game.GetRandomPoint();
        if (user.data.name == null) {
            user = new User(player);
            user.set('color', point.color);
            user.save(function (err, newUser) {
                if (err) console.log(err);
                else console.log("New user: ", newUser);
            });
        }
        game.players[playerId] = new Snake(point.x, point.y, user);
        callback();
    });
};

method.deletePlayer = function (playerId) {
    delete this.players[playerId];
};

method.processMovement = function (movement, playerId) {
    var player = this.players[playerId] || {}
    player.prototype = Snake.prototype;

    if (this.isMapWall(movement, player) == false && this.isPlayer(movement, player) == false) {
        player.moveSnake(movement);
    }

    // is food
    this.foods.forEach(function (item, index, array) {
        if (item.x === player.body[0].x && item.y === player.body[0].y) {
            this.foods.splice(index, 1);
            player.addTail();
            player.user.save(function (err, user) {
                if (err) console.log(err);
                else console.log("User updated: ", user);
            });
            this.addFood();
        }
    }, this);
};

method.isMapWall = function (movement, player) {
    return (
        (movement.up && player.body[0].y == 1) ||
        (movement.down && player.body[0].y == this.sizeY - 1) ||
        (movement.left && player.body[0].x == 1) ||
        (movement.right && player.body[0].x == this.sizeX - 1)
    );
};

method.isPlayer = function (movement, player) {
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

method.addFood = function () {
    var point = this.GetRandomPoint();
    this.foods.push(new Food(point.x, point.y, point.color));
};

method.setDirection = function (movement, playerId) {
    var player = this.players[playerId] || {}
    player.movement = movement;
}

method.makeMove = function (playerId) {
    for (var index in this.players) {
        var player = this.players[index];
        // var player = this.players[playerId] || {}
        player.prototype = Snake.prototype;
        var movement = player.movement;
        if (this.isMapWall(movement, player) == false && this.isPlayer(movement, player) == false) {
            player.moveSnake(movement);
        }

        // is food
        this.foods.forEach(function (item, index, array) {
            if (item.x === player.body[0].x && item.y === player.body[0].y) {
                this.foods.splice(index, 1);
                player.addTail();
                player.user.save(function (err, user) {
                    if (err) console.log(err);
                    else console.log("User updated: ", user);
                });
                this.addFood();
            }
        }, this);
    }
};

module.exports = Game;