let board = [];
let cols = 8;
let rows = 8;
let cellSize = 50;
let currentPlayer = 1;
let directions = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
let gameOver = false;
function inBounds(x,y){
  return x>=0 && x<cols && y>=0 && y<rows;
}
function initBoard(){
  for(let x=0;x<cols;x++){
    board[x] = [];
    for(let y=0;y<rows;y++){
      board[x][y] = 0;
    }
  }
  board[3][3] = 2;
  board[4][4] = 2;
  board[3][4] = 1;
  board[4][3] = 1;
}
function getValidMoves(color){
  let moves = [];
  let opponent = color === 1 ? 2 : 1;
  for(let x=0;x<cols;x++){
    for(let y=0;y<rows;y++){
      if(board[x][y] !== 0){
        continue;
      }
      let totalFlips = [];
      for(let i=0;i<directions.length;i++){
        let dx = directions[i][0];
        let dy = directions[i][1];
        let nx = x + dx;
        let ny = y + dy;
        let line = [];
        if(!inBounds(nx,ny)){
          continue;
        }
        if(board[nx][ny] !== opponent){
          continue;
        }
        while(inBounds(nx,ny) && board[nx][ny] === opponent){
          line.push({x:nx,y:ny});
          nx += dx;
          ny += dy;
        }
        if(inBounds(nx,ny) && board[nx][ny] === color && line.length>0){
          for(let j=0;j<line.length;j++){
            totalFlips.push(line[j]);
          }
        }
      }
      if(totalFlips.length>0){
        moves.push({x:x,y:y,flips:totalFlips});
      }
    }
  }
  return moves;
}
function applyMove(x,y,color,flips){
  board[x][y] = color;
  for(let i=0;i<flips.length;i++){
    let px = flips[i].x;
    let py = flips[i].y;
    board[px][py] = color;
  }
}
function countScores(){
  let black = 0;
  let white = 0;
  for(let x=0;x<cols;x++){
    for(let y=0;y<rows;y++){
      if(board[x][y] === 1){
        black++;
      }else if(board[x][y] === 2){
        white++;
      }
    }
  }
  return {black:black,white:white};
}
function aiMove(){
  let moves = getValidMoves(2);
  if(moves.length === 0){
    return false;
  }
  let bestCount = -1;
  let candidates = [];
  for(let i=0;i<moves.length;i++){
    let c = moves[i].flips.length;
    if(c > bestCount){
      bestCount = c;
      candidates = [moves[i]];
    }else if(c === bestCount){
      candidates.push(moves[i]);
    }
  }
  let choiceIndex = Math.floor(Math.random() * candidates.length);
  let choice = candidates[choiceIndex];
  applyMove(choice.x,choice.y,2,choice.flips);
  currentPlayer = 1;
  return true;
}
function updateTurnIfNoMoves(){
  if(gameOver){
    return;
  }
  let movesForCurrent = getValidMoves(currentPlayer);
  if(movesForCurrent.length === 0){
    let other = currentPlayer === 1 ? 2 : 1;
    let movesForOther = getValidMoves(other);
    if(movesForOther.length === 0){
      gameOver = true;
      return;
    }else{
      currentPlayer = other;
      if(currentPlayer === 2){
        aiMove();
      }
    }
  }
}
function setup(){
  createCanvas(400,400);
  initBoard();
  textSize(14);
  textAlign(LEFT,TOP);
}
function draw(){
  background(34,139,34);
  updateTurnIfNoMoves();
  stroke(0);
  for(let i=0;i<=cols;i++){
    let x = i * cellSize;
    line(x,0,x,height);
  }
  for(let j=0;j<=rows;j++){
    let y = j * cellSize;
    line(0,y,width,y);
  }
  let validMoves = getValidMoves(currentPlayer);
  noStroke();
  fill(0,0,0,80);
  for(let i=0;i<validMoves.length;i++){
    let vm = validMoves[i];
    let cx = vm.x * cellSize + cellSize/2;
    let cy = vm.y * cellSize + cellSize/2;
    ellipse(cx,cy,12,12);
  }
  for(let x=0;x<cols;x++){
    for(let y=0;y<rows;y++){
      let v = board[x][y];
      if(v === 1 || v === 2){
        let cx = x * cellSize + cellSize/2;
        let cy = y * cellSize + cellSize/2;
        stroke(0);
        if(v === 1){
          fill(0);
        }else{
          fill(255);
        }
        ellipse(cx,cy,cellSize-8,cellSize-8);
      }
    }
  }
  let scores = countScores();
  fill(255);
  noStroke();
  rect(0,0,120,40);
  fill(0);
  text(
