let blocks;
let currentBlock;
let score;
let isGameOver;

function setup() {
  createCanvas(300, 600);
  frameRate(2);
  blocks = create2DArray(10, 20);
  currentBlock = new Block();
  score = 0;
  isGameOver = false;
}

function draw() {
  background(220);
  drawBlocks();
  if (!isGameOver) {
    if (currentBlock.canMove(0, 1)) {
      currentBlock.y += 1;
    } else {
      placeBlock();
      currentBlock = new Block();
      if (!currentBlock.canMove(0, 0)) {
        isGameOver = true;
      }
    }
  }
  currentBlock.show();
  textSize(32);
  text(score, 10, 30);
}

function placeBlock() {
  for (let x = 0; x < currentBlock.shape[0].length; x++) {
    for (let y = 0; y < currentBlock.shape.length; y++) {
      if (currentBlock.shape[y][x] === 1) {
        blocks[currentBlock.x + x][currentBlock.y + y] = 1;
      }
    }
  }
  checkLines();
}

function checkLines() {
  for (let y = 0; y < blocks[0].length; y++) {
    let fullLine = true;
    for (let x = 0; x < blocks.length; x++) {
      if (blocks[x][y] === 0) {
        fullLine = false;
        break;
      }
    }
    if (fullLine) {
      removeLine(y);
      score += 100;
    }
  }
}

function removeLine(line) {
  for (let y = line; y > 0; y--) {
    for (let x = 0; x < blocks.length; x++) {
      blocks[x][y] = blocks[x][y - 1];
    }
  }
}

function drawBlocks() {
  for (let x = 0; x < blocks.length; x++) {
    for (let y = 0; y < blocks[0].length; y++) {
      if (blocks[x][y] === 1) {
        fill(255, 0, 0);
        rect(x * 30, y * 30, 30, 30);
      }
    }
  }
}

function create2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    currentBlock.move(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    currentBlock.move(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    currentBlock.move(0, 1);
  } else if (keyCode === UP_ARROW) {
    currentBlock.rotate();
  }
}

class Block {
  constructor() {
    this.x = 4;
    this.y = 0;
    this.shape = [[1, 1], [1, 1]];
  }

  show() {
    fill(255);
    for (let x = 0; x < this.shape[0].length; x++) {
      for (let y = 0; y < this.shape.length; y++) {
        if (this.shape[y][x] === 1) {
          rect((this.x + x) * 30, (this.y + y) * 30, 30, 30);
        }
      }
    }
  }

  move(dx, dy) {
    if (this.canMove(dx, dy)) {
      this.x += dx;
      this.y += dy;
    }
  }

  rotate() {
    const newShape = this.shape[0].map((val, index) =>
      this.shape.map(row => row[index])
    );
    this.shape = newShape.reverse();
  }

  canMove(dx, dy) {
    for (let x = 0; x < this.shape[0].length; x++) {
      for (let y = 0; y < this.shape.length; y++) {
        if (
          this.shape[y][x] === 1 &&
          (blocks[this.x + x + dx] === undefined ||
            blocks[this.x + x + dx][this.y + y + dy] === undefined ||
            blocks[this.x + x + dx][this.y + y + dy] === 1)
        ) {
          return false;
        }
      }
    }
    return true;
  }
}
