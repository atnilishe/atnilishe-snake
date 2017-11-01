function CreatePlayer() {
    var playerName = document.getElementById('playerName');
    socket.emit('new player', { name: playerName.value });

    var canvas = document.getElementById('canvas');
    var gameStat = document.getElementById('gameStat');
    canvas.width = 800;
    canvas.height = 600;
    var context = canvas.getContext('2d');
    socket.on('state', function(state) {
        context.clearRect(0, 0, 800, 600);
        gameStat.innerHTML = "";
        for (var id in state.players) {
            var player = state.players[id];

            var li = document.createElement("li");
            var text = document.createTextNode(player.playerInfo.name + " : " + player.body.length);
            li.style.color = player.color;
            li.appendChild(text);
            gameStat.appendChild(li);

            context.fillStyle = player.color;
            for (var i = player.body.length; i >= 0; i--) {
                context.beginPath();
                context.arc(player.body[i].x * cellSize, player.body[i].y * cellSize, cellSize / 2, 0, 2 * Math.PI);
                context.fill();
            }
        }

        for (var id in state.foods) {
            var food = state.foods[id];
            context.fillStyle = food.color;
            context.beginPath();
            context.arc(food.x * cellSize, food.y * cellSize, cellSize / 2, 0, 2 * Math.PI);
            context.fill();
        }
    });
}

var socket = io();

var cellSize = 20;

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

function up() {
    movement.left = false;
    movement.up = true;
    movement.right = false;
    movement.down = false;
}

function down() {
    movement.left = false;
    movement.up = false;
    movement.right = false;
    movement.down = true;
}

function left() {
    movement.left = true;
    movement.up = false;
    movement.right = false;
    movement.down = false;
}

function right() {
    movement.left = false;
    movement.up = false;
    movement.right = true;
    movement.down = false;
}

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 37: // left
        case 65: // A
            left();
            break;
        case 38: // up
        case 87: // W
            up();
            break;
        case 39: // right
        case 68: // D
            right();
            break;
        case 40: // down
        case 83: // S
            down();
            break;
    }
    socket.emit('movement', movement);
});

document.addEventListener('keyup', function(event) {
    movement.left = false;
    movement.up = false;
    movement.right = false;
    movement.down = false;
});