var method = Food.prototype;

function Food(x, y, color) {
    this.color = color;
    this.x = x;
    this.y = y;
}

module.exports = Food;