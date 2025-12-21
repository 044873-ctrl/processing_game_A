let COLS = 15;
let ROWS = 30;
let CELL = 20;
let canvasW = 300;
let canvasH = 600;
let board = [];
let shapes = [];
let colors = [];
let current = null;
let frameCountLocal = 0;
let baseDropFrames = 30;
let moveHoldCounter = 0;
let moveHoldDelay = 6;
let leftHold = false;
let rightHold = false;
let score = 0;
let gameOver = false;

function createShapes() {
  shapes = [
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,0,0],
      [1,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,0,1,0],
      [1,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [1,0,0,0],
      [1,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [1,1,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [1,1,0,0],
      [0,1,1,0],
      [0,0,0,0]
    ]
  ];
}

function createColors() {
  colors = [
    [0,0,0],
    [0,255,255],
    [255,255,0],
    [128,0,128],
    [255,165,0],
    [0,0,255],
    [0,255,0],
    [255,0,0]
  ];
}

function resetBoard() {
  board = [];
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      row.push(0);
    }
    board.push(row);
  }
}

function spawnPiece() {
  let index = Math.floor(Math.random() * shapes.length);
  let shape = [];
  for (let r = 0; r < 4; r++) {
    shape[r] = [];
    for (let c = 0; c < 4; c++) {
      shape[r][c] = shapes[index][r][c];
    }
  }
  let x = Math.floor((COLS - 4) / 2);
  let y = 0;
  let piece = {
    shape: shape,
    x: x,
    y: y,
    colorIndex: index + 1
  };
  return piece;
}

function collidesAt(piece, nx, ny) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (piece.shape[r][c] !== 0) {
        let boardX = nx + c;
        let boardY = ny + r;
        if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
          return true;
        }
        if (boardY >= 0) {
          if (board[boardY][boardX] !== 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function lockPiece(piece) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (piece.shape[r][c] !== 0) {
        let boardX = piece.x + c;
        let boardY = piece.y + r;
        if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
          board[boardY][boardX] = piece.colorIndex;
        }
      }
    }
  }
}

function clearLines() {
  let linesCleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    let full = true;
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      board.splice(r, 1);
      let newRow = [];
      for (let c = 0; c < COLS; c++) {
        newRow.push(0);
      }
      board.unshift(newRow);
      linesCleared++;
      r++;
    }
  }
  if (linesCleared > 0) {
    score += linesCleared * 100;
  }
}

function rotateMatrix(mat) {
  let res = [];
  for (let r = 0; r < 4; r++) {
    res[r] = [];
    for (let c = 0; c < 4; c++) {
      res[r][c] = mat[4 - 1 - c][r];
    }
  }
  return res;
}

function tryRotate(piece) {
  let newShape = rotateMatrix(piece.shape);
  let backup = piece.shape;
  piece.shape = newShape;
  if (collidesAt(piece, piece.x, piece.y)) {
    piece.shape = backup;
  }
}

function attemptMove(dx, dy) {
  if (current === null) {
    return;
  }
  let nx = current.x + dx;
  let ny = current.y + dy;
  if (!collidesAt(current, nx, ny)) {
    current.x = nx;
    current.y = ny;
    return true;
  }
  return false;
}

function newPieceOrGameOver() {
  current = spawnPiece();
  if (collidesAt(current, current.x, current.y)) {
    gameOver = true;
  }
}

function setup() {
  createShapes();
  createColors();
  createCanvas(canvasW, canvasH);
  resetBoard();
  current = spawnPiece();
  if (collidesAt(current, current.x, current.y)) {
    gameOver = true;
  }
  frameRate(60);
}

function drawCell(x, y, colorIndex) {
  let col = colors[colorIndex];
  fill(col[0], col[1], col[2]);
  noStroke();
  rect(x * CELL, y * CELL, CELL, CELL);
  stroke(30);
  noFill();
  rect(x * CELL, y * CELL, CELL, CELL);
}

function draw() {
  background(0);
  frameCountLocal++;
  if (!gameOver) {
    let dropNow = false;
    let dropFrames = baseDropFrames;
    if (keyIsDown(DOWN_ARROW)) {
      dropFrames = 1;
    }
    if (frameCountLocal % dropFrames === 0) {
      dropNow = true;
    }
    if (dropNow) {
      let moved = attemptMove(0,1);
      if (!moved) {
        lockPiece(current);
        clearLines();
        newPieceOrGameOver();
      }
    }
    if (keyIsDown(LEFT_ARROW)) {
      if (!leftHold) {
        attemptMove(-1,0);
        leftHold = true;
        moveHoldCounter = 0;
      } else {
        moveHoldCounter++;
        if (moveHoldCounter >= moveHoldDelay) {
          attemptMove(-1,0);
          moveHoldCounter = 0;
        }
      }
    } else {
      leftHold = false;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      if (!rightHold) {
        attemptMove(1,0);
        rightHold = true;
        moveHoldCounter = 0;
      } else {
        moveHoldCounter++;
        if (moveHoldCounter >= moveHoldDelay) {
          attemptMove(1,0);
          moveHoldCounter = 0;
        }
      }
    } else {
      rightHold = false;
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== 0) {
        drawCell(c, r, board[r][c]);
      } else {
        noFill();
        stroke(40);
        rect(c * CELL, r * CELL, CELL, CELL);
      }
    }
  }
  if (current !== null) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (current.shape[r][c] !== 0) {
          let bx = current.x + c;
          let by = current.y + r;
          if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
            drawCell(bx, by, current.colorIndex);
          }
        }
      }
    }
  }
  fill(255);
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  text("SCORE: " + score, 5, 5);
  if (gameOver) {
    fill(0,0,0,180);
    rect(0, height/2 - 30, width, 60);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
  }
}

function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === UP_ARROW) {
    if (current !== null) {
      tryRotate(current);
    }
  }
  if (keyCode === LEFT_ARROW) {
    attemptMove(-1,0);
    leftHold = true;
    moveHoldCounter = 0;
  }
  if (keyCode === RIGHT_ARROW) {
    attemptMove(1,0);
    rightHold = true;
    moveHoldCounter = 0;
  }
  if (keyCode === DOWN_ARROW) {
    attemptMove(0,1);
  }
}
