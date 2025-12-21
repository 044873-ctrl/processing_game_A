let cols = 20;
let rows = 20;
let cellSize = 20;
let snake = [];
let dir = {x: 1, y: 0};
let nextDir = {x: 1, y: 0};
let food = {x: 0, y: 0};
let score = 0;
let moveInterval = 10;
let tick = 0;
let gameOver = false;
function setup() {
  createCanvas(cols * cellSize, rows * cellSize);
  let centerX = floor(cols / 2);
  let centerY = floor(rows / 2);
  for (let i = 0; i < 3; i++) {
    snake.push({x: centerX - i, y: centerY});
  }
  generateFood();
  textSize(16);
  textAlign(LEFT, TOP);
}
function draw() {
  background(220);
  drawFood();
  drawSnake();
  drawScore();
  if (!gameOver) {
    tick++;
    if (tick >= moveInterval) {
      tick = 0;
      dir = {x: nextDir.x, y: nextDir.y};
      let newX = snake[0].x + dir.x;
      let newY = snake[0].y + dir.y;
      if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
        gameOver = true;
        return;
      }
      let willEat = newX === food.x && newY === food.y;
      for (let i = 0; i < snake.length; i++) {
        if (!willEat && i === snake.length - 1) {
          continue;
        }
        if (snake[i].x === newX && snake[i].y === newY) {
          gameOver = true;
          return;
        }
      }
      snake.unshift({x: newX, y: newY});
      if (willEat) {
        score++;
        generateFood();
      } else {
        snake.pop();
      }
    }
  } else {
    drawGameOver();
  }
}
function drawSnake() {
  noStroke();
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      fill(0, 150, 0);
    } else {
      fill(0, 200, 0);
    }
    rect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize, cellSize);
  }
}
function drawFood() {
  fill(200, 0, 0);
  rect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}
function drawScore() {
  fill(0);
  textAlign(LEFT, TOP);
  text("Score: " + score, 8, 8);
}
function drawGameOver() {
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Game Over", width / 2, height / 2);
  textSize(16);
  textAlign(LEFT, TOP);
}
function generateFood() {
  if (snake.length >= cols * rows) {
    food.x = 0;
    food.y = 0;
    return;
  }
  while (true) {
    let fx = floor(random(cols));
    let fy = floor(random(rows));
    let collision = false;
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === fx && snake[i].y === fy) {
        collision = true;
        break;
      }
    }
    if (!collision) {
      food.x = fx;
      food.y = fy;
      break;
    }
  }
}
function keyPressed() {
  let nd = {x: dir.x, y: dir.y};
  if (keyCode === LEFT_ARROW) {
    nd = {x: -1, y: 0};
  } else if (keyCode === RIGHT_ARROW) {
    nd = {x: 1, y: 0};
  } else if (keyCode === UP_ARROW) {
    nd = {x: 0, y: -1};
  } else if (keyCode === DOWN_ARROW) {
    nd = {x: 0, y: 1};
  } else {
    return;
  }
  if (nd.x + dir.x !== 0 || nd.y + dir.y !== 0) {
    nextDir = {x: nd.x, y: nd.y};
  }
}
