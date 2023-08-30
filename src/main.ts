const $canva: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;

const ctx = $canva.getContext('2d') as CanvasRenderingContext2D;
namespace functions {
    export function generateRandomColor(): string {
         const letters = '0123456789ABCDEF';
         let color = '#';
     
         for (let i = 0; i < 6; i++) {
             color += letters[Math.floor(Math.random() * 16)];
         }
         return color;
     }  
 }
 
$canva.addEventListener('click', (e:MouseEvent) => {
    const canvasCornerX = $canva.getBoundingClientRect().left
    const canvasCornerY = $canva.getBoundingClientRect().top
    const clickCoordinates = new Vector2(e.clientX - canvasCornerX, e.clientY - canvasCornerY)
    Canva.shapes.forEach((shape:Shape) => {
        shape.checkClick(clickCoordinates.x, clickCoordinates.y)
    })
})




class Canva {

   static frame:CanvasRenderingContext2D = ctx
   static shapes: Shape[] = []

  static renderFrame() {
      Canva.shapes.forEach((shape: Shape) => shape.render());
   }

  static eraseFrame() {
      Canva.frame.clearRect(0, 0, $canva.width, $canva.height);
   }
}

class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface IClickable {
    checkClick(mouseX: number, mouseY: number):void
    onClick(x: number, y: number):void
}

interface IDraggable {
    checkClick(mouseX: number, mouseY: number):void
    onClick(x: number, y: number):void
}
interface IRenderable {
    render():void
}


abstract class Shape implements IClickable, IDraggable {
   abstract checkClick(mouseX: number, mouseY: number): void 
   abstract onClick(x: number, y: number): void 
   abstract position: Vector2;
   abstract color: string;
   abstract render(): void;
}

class Rect extends Shape {
    position: Vector2;
    color: string;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number, color:string) {
        super();
        this.position = new Vector2(x, y);
        this.width = width;
        this.height = height;
        this.color = color
    }
    render(): void {
        Canva.frame.fillStyle = this.color;
        Canva.frame.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    checkClick(mouseX: number, mouseY: number): void {
        if (mouseX > this.position.x && mouseX < this.position.x + this.width && mouseY > this.position.y && mouseY < this.position.y + this.height) {
            this.onClick(this.position.x, this.position.y)
        }
    }
    onClick(x: number, y: number): void {
        this.color = functions.generateRandomColor();
    }
}

class StrokeRect extends Shape {
    position: Vector2;
    color: string;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number, color:string) {
        super();
        this.position = new Vector2(x, y);
        this.width = width;
        this.height = height;
        this.color = color
    }
    render(): void {
       Canva.frame.strokeStyle = this.color;
       Canva.frame.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }

    checkClick(mouseX: number, mouseY: number): void {
        if (mouseX > this.position.x && mouseX < this.position.x + this.width && mouseY > this.position.y && mouseY < this.position.y + this.height) {
            this.onClick(this.position.x, this.position.y)
        }
    }
    onClick(x: number, y: number): void {
        this.position.x+= 10
    }
}


const rect1 = new Rect(0, 0, 100, 100, 'red');

const rect2 = new Rect(100, 100, 100, 100, 'blue');

const strokeRect = new StrokeRect(200, 200, 100, 100, 'yellow');


Canva.shapes.push(rect1, rect2, strokeRect);

function render (onErase: () => void) {
    Canva.eraseFrame();
    onErase();
}

setInterval(()=>render(Canva.renderFrame), 1000/60);

rect1.color = 'green';