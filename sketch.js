let grid;
const SIZE = 4;
const TILE = 100;
let gameOver = false;
function createEmptyGrid() {
  let g = [];
  for (let r = 0; r < SIZE; r++) {
    let row = [];
    for (let c = 0; c < SIZE; c++) {
      row.push(0);
    }
    g.push(row);
  }
  return g;
}
function addRandomTwo() {
  let empties = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) {
        empties.push({ r: r, c: c });
      }
    }
  }
  if (empties.length === 0) {
    return false;
  }
  let idx = Math.floor(Math.random() * empties.length);
  let cell = empties[idx];
  grid[cell.r][cell.c] = 2;
  return true;
}
function resetGame() {
  grid = createEmptyGrid();
  addRandomTwo();
  addRandomTwo();
  gameOver = false;
}
function rowsEqual(a, b) {
  for (let i = 0; i < SIZE; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
function moveLeftRow(row) {
  let nonZero = [];
  for (let i = 0; i < SIZE; i++) {
    if (row[i] > 0) {
      nonZero.push(row[i]);
    }
  }
  let newRow = [];
  for (let i = 0; i < nonZero.length; i++) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      newRow.push(nonZero[i] * 2);
      i++;
    } else {
      newRow.push(nonZero[i]);
    }
  }
  while (newRow.length < SIZE) {
    newRow.push(0);
  }
  let moved = !rowsEqual(row, newRow);
  return { newRow: newRow, moved: moved };
}
function moveLeft() {
  let movedAny = false;
  for (let r = 0; r < SIZE; r++) {
    let res = moveLeftRow(grid[r]);
    if (res.moved) {
      grid[r] = res.newRow;
      movedAny = true;
    }
  }
  return movedAny;
}
function moveRight() {
  let movedAny = false;
  for (let r = 0; r < SIZE; r++) {
    let rev = [];
    for (let c = SIZE - 1; c >= 0; c--) {
      rev.push(grid[r][c]);
    }
    let res = moveLeftRow(rev);
    if (res.moved) {
      let newRev = res.newRow;
      for (let c = 0; c < SIZE; c++) {
        grid[r][SIZE - 1 - c] = newRev[c];
      }
      movedAny = true;
    }
  }
  return movedAny;
}
function moveUp() {
  let movedAny = false;
  for (let c = 0; c < SIZE; c++) {
    let col = [];
    for (let r = 0; r < SIZE; r++) {
      col.push(grid[r][c]);
    }
    let res = moveLeftRow(col);
    if (res.moved) {
      let newCol = res.newRow;
      for (let r = 0; r < SIZE; r++) {
        grid[r][c] = newCol[r];
      }
      movedAny = true;
    }
  }
  return movedAny;
}
function moveDown() {
  let movedAny = false;
  for (let c = 0; c < SIZE; c++) {
    let col = [];
    for (let r = SIZE - 1; r >= 0; r--) {
      col.push(grid[r][c]);
    }
    let res = moveLeftRow(col);
    if (res.moved) {
      let newCol = res.newRow;
      for (let r = 0; r < SIZE; r++) {
        grid[SIZE - 1 - r][c] = newCol[r];
      }
      movedAny = true;
    }
  }
  return movedAny;
}
function canMove() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) {
        return true;
      }
    }
  }
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 1; c++) {
      if (grid[r][c] === grid[r][c + 1]) {
        return true;
      }
    }
  }
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 1; r++) {
      if (grid[r][c] === grid[r + 1][c]) {
        return true;
      }
    }
  }
  return false;
}
function keyPressed() {
  if (gameOver) {
    if (key === 'r' || key === 'R') {
      resetGame();
    }
    return;
  }
  let moved = false;
  if (keyCode === LEFT_ARROW) {
    moved = moveLeft();
  } else if (keyCode === RIGHT_ARROW) {
    moved = moveRight();
  } else if (keyCode === UP_ARROW) {
    moved = moveUp();
  } else if (keyCode === DOWN_ARROW) {
    moved = moveDown();
  } else if (key === 'r' || key === 'R') {
    resetGame();
    return;
  }
  if (moved) {
    addRandomTwo();
    if (!canMove()) {
      gameOver = true;
    }
  }
}
function setup() {
  createCanvas(400, 400);
  grid = createEmptyGrid();
  resetGame();
  textAlign(CENTER, CENTER);
  textSize(32);
  noStroke();
}
function draw() {
  background(187, 173, 160);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      let x = c * TILE;
      let y = r * TILE;
      let val = grid[r][c];
      if (val === 0) {
        fill(205, 193, 180);
        rect(x + 10, y + 10, TILE - 20, TILE - 20, 8);
      } else {
        let colors = {
          2: [238, 228, 218],
          4: [237, 224, 200],
          8: [242, 177, 121],
          16: [245, 149, 99],
          32: [246, 124, 95],
          64: [246, 94, 59],
          128: [237, 207, 114],
          256: [237, 204, 97],
          512: [237, 200, 80],
          1024: [237, 197, 63],
          2048: [237, 194, 46]
        };
        let col = colors[val];
        if (col === undefined) {
          fill(60, 58, 50);
        } else {
          fill(col[0], col[1], col[2]);
        }
        rect(x + 10, y + 10, TILE - 20, TILE - 20, 8);
        if (val <= 4) {
          fill(119, 110, 101);
        } else {
          fill(249, 246, 242);
        }
        textSize(val < 128 ? 36 : 24);
        text(val.toString(), x + TILE / 2, y + TILE / 2);
      }
    }
  }
  if (gameOver) {
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    fill(255);
    textSize(48);
    text("Game Over", width / 2, height / 2 - 20);
    textSize(20);
    text("Press R to restart", width / 2, height / 2 + 30);
  }
}
