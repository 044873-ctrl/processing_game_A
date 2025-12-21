let COLS = 10;
let ROWS = 20;
let CELL = 30;
let DROP_INTERVAL = 30;
let grid = null;
let pieces = null;
let colors = null;
let currentPiece = null;
let frameCounter = 0;
let score = 0;
let gameOver = false;
function createEmptyGrid() {
  let g = [];
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      row.push(0);
    }
    g.push(row);
  }
  return g;
}
function deepCopyMatrix(m) {
  let out = [];
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 0; c < 4; c++) {
      row.push(m[r][c]);
    }
    out.push(row);
  }
  return out;
}
function rotateMatrix(m) {
  let out = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      out[c][3 - r] = m[r][c];
    }
  }
  return out;
}
function canPlaceMatrixAt(mat, px, py) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (mat[r][c]) {
        let gx = px + c;
        let gy = py + r;
        if (gx < 0 || gx >= COLS) {
          return false;
        }
        if (gy >= ROWS) {
          return false;
        }
        if (gy >= 0) {
          if (grid[gy][gx] !== 0) {
            return false;
          }
        }
      }
    }
  }
  return true;
}
function lockCurrentPiece() {
  let mat = currentPiece.matrix;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (mat[r][c]) {
        let gx = currentPiece.x + c;
        let gy = currentPiece.y + r;
        if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
          grid[gy][gx] = currentPiece.id + 1;
        }
      }
    }
  }
  clearLines();
  spawnPiece();
}
function clearLines() {
  for (let r = ROWS - 1; r >= 0; r--) {
    let full = true;
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      grid.splice(r, 1);
      let newRow = [];
      for (let i = 0; i < COLS; i++) {
        newRow.push(0);
      }
      grid.unshift(newRow);
      score += 100;
      r++;
    }
  }
}
function spawnPiece() {
  let id = Math.floor(Math.random() * pieces.length);
  let mat = deepCopyMatrix(pieces[id]);
  let px = Math.floor(COLS / 2) - 2;
  let py = -1;
  let piece = {
    id: id,
    matrix: mat,
    x: px,
    y: py
  };
  currentPiece = piece;
  if (!canPlaceMatrixAt(currentPiece.matrix, currentPiece.x, currentPiece.y)) {
    gameOver = true;
  }
}
function moveCurrent(dx) {
  if (gameOver) {
    return;
  }
  let nx = currentPiece.x + dx;
  if (canPlaceMatrixAt(currentPiece.matrix, nx, currentPiece.y)) {
    currentPiece.x = nx;
  }
}
function rotateCurrent() {
  if (gameOver) {
    return;
  }
  let rotated = rotateMatrix(currentPiece.matrix);
  if (canPlaceMatrixAt(rotated, currentPiece.x, currentPiece.y)) {
    currentPiece.matrix = rotated;
  }
}
function stepDown() {
  if (gameOver) {
    return;
  }
  if (canPlaceMatrixAt(currentPiece.matrix, currentPiece.x, currentPiece.y + 1)) {
    currentPiece.y += 1;
  } else {
    lockCurrentPiece();
  }
}
function setupPiecesAndColors() {
  pieces = [
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,1,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [1,0,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,1,0],
      [1,1,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [1,1,0,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ]
  ];
  colors = [];
  colors.push(color(0, 255, 255));
  colors.push(color(255, 255, 0));
  colors.push(color(128, 0, 128));
  colors.push(color(255, 165, 0));
  colors.push(color(0, 0, 255));
  colors.push(color(0, 255, 0));
  colors.push(color(255, 0, 0));
}
function drawGrid() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let val = grid[r][c];
      stroke(50);
      if (val === 0) {
        fill(30);
      } else {
        let colIndex = constrain(val - 1, 0, colors.length - 1);
        fill(colors[colIndex]);
      }
      rect(c * CELL, r * CELL, CELL, CELL);
    }
  }
}
function drawCurrentPiece() {
  if (!currentPiece) {
    return;
  }
  let mat = currentPiece.matrix;
  let col = currentPiece.id;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (mat[r][c]) {
        let gx = currentPiece.x + c;
        let gy = currentPiece.y + r;
        if (gy >= 0) {
          if (col >= 0 && col < colors.length) {
            fill(colors[col]);
          } else {
            fill(200);
          }
          stroke(50);
          rect(gx * CELL, gy * CELL, CELL, CELL);
        }
      }
    }
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    moveCurrent(-1);
  } else if (keyCode === RIGHT_ARROW) {
    moveCurrent(1);
  } else if (keyCode === UP_ARROW) {
    rotateCurrent();
  } else if (keyCode === DOWN_ARROW) {
    stepDown();
  }
}
function setup() {
  createCanvas(COLS * CELL, ROWS * CELL);
  grid = createEmptyGrid();
  setupPiecesAndColors();
  score = 0;
  frameCounter = 0;
  gameOver = false;
  spawnPiece();
}
function draw() {
  background(20);
  if (!gameOver) {
    frameCounter++;
    let interval = DROP_INTERVAL;
    if (keyIsDown(DOWN_ARROW)) {
      interval = 2;
    }
    if (frameCounter % interval === 0) {
      stepDown();
    }
  }
  drawGrid();
  drawCurrentPiece();
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 5, 5);
  if (gameOver) {
    fill(0, 180);
    rect(0, height / 2 - 30, width, 60);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
  }
}
