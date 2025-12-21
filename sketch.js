const COLS = 10;
const ROWS = 20;
const CELL = 30;
let board = [];
let shapes = [];
let colors = [];
let current = null;
let dropCounter = 0;
let dropIntervalDefault = 30;
let running = true;
let score = 0;
function setup(){
  createCanvas(300,600);
  for(let r=0;r<ROWS;r++){
    let row = [];
    for(let c=0;c<COLS;c++){
      row.push(0);
    }
    board.push(row);
  }
  shapes = [
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
  colors = [
    color(0,190,190),
    color(240,200,0),
    color(160,60,200),
    color(255,120,0),
    color(0,80,255),
    color(80,200,0),
    color(220,40,40)
  ];
  spawnPiece();
  textSize(16);
  textAlign(LEFT,TOP);
}
function draw(){
  background(30);
  stroke(40);
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      let v = board[r][c];
      if(v===0){
        fill(20);
      } else {
        fill(colors[v-1]);
      }
      rect(c*CELL, r*CELL, CELL, CELL);
    }
  }
  if(current!==null){
    for(let r=0;r<4;r++){
      for(let c=0;c<4;c++){
        if(current.shape[r][c]===1){
          let bx = current.x + c;
          let by = current.y + r;
          if(by>=0){
            fill(colors[current.colorIndex-1]);
            rect(bx*CELL, by*CELL, CELL, CELL);
          }
        }
      }
    }
  }
  fill(255);
  noStroke();
  text(score,8,8);
  stroke(40);
  if(!running){
    return;
  }
  dropCounter++;
  let interval = dropIntervalDefault;
  if(keyIsDown(DOWN_ARROW)){
    interval = 2;
  }
  if(dropCounter>=interval){
    dropCounter = 0;
    if(current!==null){
      if(canMove(0,1,current.shape,current.x,current.y)){
        current.y++;
      } else {
        lockPiece();
        spawnPiece();
      }
    }
  }
}
function cloneShape(s){
  let out = [];
  for(let r=0;r<4;r++){
    out.push(s[r].slice());
  }
  return out;
}
function rotateShape(s){
  let out = [];
  for(let r=0;r<4;r++){
    out.push([0,0,0,0]);
  }
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      out[c][3-r] = s[r][c];
    }
  }
  return out;
}
function canMove(dx,dy,shape,x,y){
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      if(shape[r][c]===1){
        let nx = x + c + dx;
        let ny = y + r + dy;
        if(nx<0 || nx>=COLS) return false;
        if(ny>=ROWS) return false;
        if(ny>=0){
          if(board[ny][nx]!==0) return false;
        }
      }
    }
  }
  return true;
}
function lockPiece(){
  if(current===null) return;
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      if(current.shape[r][c]===1){
        let bx = current.x + c;
        let by = current.y + r;
        if(by>=0 && by<ROWS && bx>=0 && bx<COLS){
          board[by][bx] = current.colorIndex;
        }
      }
    }
  }
  clearLines();
  current = null;
}
function clearLines(){
  for(let r=ROWS-1;r>=0;r--){
    let full = true;
    for(let c=0;c<COLS;c++){
      if(board[r][c]===0){ full = false; break; }
    }
    if(full){
      board.splice(r,1);
      let newRow = [];
      for(let c=0;c<COLS;c++) newRow.push(0);
      board.unshift(newRow);
      score += 100;
      r++;
    }
  }
}
function spawnPiece(){
  if(!running) return;
  let idx = floor(random(0, shapes.length));
  let s = cloneShape(shapes[idx]);
  let px = floor(COLS/2)-2;
  let py = -1;
  let colIdx = idx+1;
  if(!canMove(0,0,s,px,py)){
    running = false;
    return;
  }
  current = {shape: s, x: px, y: py, colorIndex: colIdx};
}
function keyPressed(){
  if(!running) return;
  if(current===null) return;
  if(keyCode===LEFT_ARROW){
    if(canMove(-1,0,current.shape,current.x,current.y)){
      current.x--;
    }
  } else if(keyCode===RIGHT_ARROW){
    if(canMove(1,0,current.shape,current.x,current.y)){
      current.x++;
    }
  } else if(keyCode===DOWN_ARROW){
    if(canMove(0,1,current.shape,current.x,current.y)){
      current.y++;
    } else {
      lockPiece();
      spawnPiece();
    }
    dropCounter = 0;
  } else if(keyCode===UP_ARROW){
    let rshape = rotateShape(current.shape);
    if(canMove(0,0,rshape,current.x,current.y)){
      current.shape = rshape;
    }
  }
}
