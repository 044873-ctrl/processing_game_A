let paddle;
let ball;
let bricks = [];

function setup() {
  createCanvas(800, 600);
  paddle = new Paddle();
  ball = new Ball(paddle);
  for (let i = 0; i < 16; i++) {
    bricks[i] = new Brick(i * 50, 0, 50, 20);
  }
}

function draw() {
  background(0);
  paddle.display();
  paddle.update();
  ball.display();
  ball.update();
  for (let i = bricks.length - 1; i >= 0; i--) {
    bricks[i].display();
    if (ball.hits(bricks[i])) {
      bricks.splice(i, 1);
      ball.direction.y *= -1;
    }
  }
}

class Paddle {
  constructor() {
    this.width = 150;
    this.height = 20;
    this.x = (width - this.width) / 2;
    this.speed = 2;
  }
  
  display() {
    rect(this.x, height - this.height, this.width, this.height);
  }
  
  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
  }
}

class Ball {
  constructor(paddle) {
    this.radius = 10;
    this.x = paddle.x + paddle.width / 2;
    this.y = height - paddle.height - this.radius;
    this.direction = createVector(1, -1);
    this.speed = 2;
  }
  
  display() {
    ellipse(this.x, this.y, this.radius * 2);
  }
  
  update() {
    this.x += this.speed * this.direction.x;
    this.y += this.speed * this.direction.y;
    if (this.x < 0 || this.x > width) this.direction.x *= -1;
    if (this.y < 0) this.direction.y *= -1;
  }
  
  hits(brick) {
    let d = dist(this.x, this.y, brick.x, brick.y);
    if (d < this.radius + brick.height / 2) {
      return true;
    } else {
      return false;
    }
  }
}

class Brick {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
  
  display() {
    rect(this.x, this.y, this.width, this.height);
  }
}
