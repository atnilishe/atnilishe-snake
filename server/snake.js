var method = Snake.prototype;

function Snake(x, y, color, playerInfo) {
    this.playerInfo = playerInfo;
    this.color = color;
    this.body = { length: 0 };
    this.body[0] = {
        x: x,
        y: y
    };
    console.log(playerInfo.length);
    if(playerInfo.length)
    {
        for (var i = 0; i < playerInfo.length; i++)
        {
            this.addTail();
        }
    }
}

method.addTail = function() {
    this.body.length += 1;
    this.body[this.body.length] = {
        x: this.body[0].x,
        y: this.body[0].y
    };
};

method.movePlayer = function(movement) {
    for (var i = this.body.length; i > 0; i--) {
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