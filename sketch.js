let blocks = [];
let currentBlock;
let blockSize = 30;
let cols, rows;
let gameOver = false;

function setup() {
  createCanvas(300, 600);
  cols = width / blockSize;
  rows = height / blockSize;
  frameRate(2);
  currentBlock = new Block();
}

function draw() {
  background(220);

  if (!gameOver) {
    if (currentBlock) {
      currentBlock.show();
      currentBlock.update();

      if (currentBlock.hitBottom()) {
        blocks.push(currentBlock);
        currentBlock = new Block();

        for (let i = blocks.length - 1; i >= 0; i--) {
          if (blocks[i].offScreen()) {
            gameOver = true;
          }
        }
      }
    }

    for (let i = 0; i < blocks.length; i++) {
      blocks[i].show();
    }

    for (let i = blocks.length - 1; i >= 0; i--) {
      if (blocks[i].isRowFull()) {
        blocks.splice(i, 1);
      }
    }
  } else {
    textSize(32);
    text('Game Over', width / 2, height / 2);
  }
}

function Block() {
  this.x = width / 2;
  this.y = 0;

  this.show = function() {
    fill(255);
    rect(this.x, this.y, blockSize, blockSize);
  }

  this.update = function() {
    this.y += blockSize;

    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].hit(this)) {
        this.y -= blockSize;
        return true;
      }
    }

    return false;
  }

  this.hitBottom = function() {
    if (this.y === height - blockSize) {
      return true;
    }

    return this.update();
  }

  this.hit = function(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    if (d < blockSize) {
      return true;
    } else {
      return false;
    }
  }

  this.isRowFull = function() {
    let full = true;
    for (let i = 0; i < cols; i++) {
      if (!this.hit({ x: i * blockSize, y: this.y })) {
        full = false;
      }
    }

    return full;
  }

  this.offScreen = function() {
    return (this.y < 0);
  }
}
