"use strict";
const $canva = document.querySelector('#canvas');
const ctx = $canva.getContext('2d');
var functions;
(function (functions) {
    function generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    functions.generateRandomColor = generateRandomColor;
})(functions || (functions = {}));
$canva.addEventListener('click', (e) => {
    const canvasCornerX = $canva.getBoundingClientRect().left;
    const canvasCornerY = $canva.getBoundingClientRect().top;
    const clickCoordinates = new Vector2(e.clientX - canvasCornerX, e.clientY - canvasCornerY);
    Canva.shapes.forEach((shape) => {
        shape.checkClick(clickCoordinates.x, clickCoordinates.y);
    });
});
class Canva {
    static renderFrame() {
        Canva.shapes.forEach((shape) => shape.render());
    }
    static eraseFrame() {
        Canva.frame.clearRect(0, 0, $canva.width, $canva.height);
    }
}
Canva.frame = ctx;
Canva.shapes = [];
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Shape {
}
class Rect extends Shape {
    constructor(x, y, width, height, color) {
        super();
        this.position = new Vector2(x, y);
        this.width = width;
        this.height = height;
        this.color = color;
    }
    render() {
        Canva.frame.fillStyle = this.color;
        Canva.frame.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    checkClick(mouseX, mouseY) {
        if (mouseX > this.position.x && mouseX < this.position.x + this.width && mouseY > this.position.y && mouseY < this.position.y + this.height) {
            this.onClick(this.position.x, this.position.y);
        }
    }
    onClick(x, y) {
        this.color = functions.generateRandomColor();
    }
}
class StrokeRect extends Shape {
    constructor(x, y, width, height, color) {
        super();
        this.position = new Vector2(x, y);
        this.width = width;
        this.height = height;
        this.color = color;
    }
    render() {
        Canva.frame.strokeStyle = this.color;
        Canva.frame.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }
    checkClick(mouseX, mouseY) {
        if (mouseX > this.position.x && mouseX < this.position.x + this.width && mouseY > this.position.y && mouseY < this.position.y + this.height) {
            this.onClick(this.position.x, this.position.y);
        }
    }
    onClick(x, y) {
        this.position.x += 10;
    }
}
const rect1 = new Rect(0, 0, 100, 100, 'red');
const rect2 = new Rect(100, 100, 100, 100, 'blue');
const strokeRect = new StrokeRect(200, 200, 100, 100, 'yellow');
Canva.shapes.push(rect1, rect2, strokeRect);
function render(onErase) {
    Canva.eraseFrame();
    onErase();
}
setInterval(() => render(Canva.renderFrame), 1000 / 60);
rect1.color = 'green';
