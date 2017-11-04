var method = Snake.prototype;

function Snake(x, y, user) {
    this.user = user;
    this.body = {};
    this.movement = {};
    this.body[0] = {
        x: x,
        y: y
    };

    for (var i = 0; i <= user.data.length; i++) {
        this.body[i] = {
            x: this.body[0].x,
            y: this.body[0].y
        };
    }
}

method.addTail = function () {
    this.user.data.length += 1;
    this.body[this.user.data.length] = {
        x: this.body[0].x,
        y: this.body[0].y
    };
};

method.moveSnake = function (movement) {
    for (var i = this.user.data.length; i > 0; i--) {
        this.body[i].x = this.body[i - 1].x;
        this.body[i].y = this.body[i - 1].y;
    }
    if (movement.left) {
        this.body[0].x -= 1;
    }
    if (movement.up) {
        this.body[0].y -= 1;
    }
    if (movement.right) {
        this.body[0].x += 1;
    }
    if (movement.down) {
        this.body[0].y += 1;
    }
};

module.exports = Snake;