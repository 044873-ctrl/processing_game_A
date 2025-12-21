let grid;
let sizeGrid;
let tileSize;
let score;
let gameOver;
function initGrid(){
  grid = [];
  for(let y=0;y<4;y++){
    let row = [];
    for(let x=0;x<4;x++){
      row.push(0);
    }
    grid.push(row);
  }
}
function getEmptyCells(){
  let empties = [];
  for(let y=0;y<4;y++){
    for(let x=0;x<4;x++){
      if(grid[y][x]===0){
        empties.push({x:x,y:y});
      }
    }
  }
  return empties;
}
function addRandomTwo(){
  let empties = getEmptyCells();
  if(empties.length===0){
    return;
  }
  let idx = Math.floor(Math.random()*empties.length);
  let cell = empties[idx];
  grid[cell.y][cell.x]=2;
}
function rowsEqual(a,b){
  for(let i=0;i<4;i++){
    if(a[i]!==b[i]){return false;}
  }
  return true;
}
function moveLeft(){
  let moved=false;
  for(let y=0;y<4;y++){
    let orig = [grid[y][0],grid[y][1],grid[y][2],grid[y][3]];
    let arr = [];
    for(let x=0;x<4;x++){
      if(orig[x]!==0){arr.push(orig[x]);}
    }
    let merged = [];
    let i=0;
    while(i<arr.length){
      if(i+1<arr.length && arr[i]===arr[i+1]){
        let val = arr[i]*2;
        score+=val;
        merged.push(val);
        i+=2;
      } else {
        merged.push(arr[i]);
        i+=1;
      }
    }
    while(merged.length<4){merged.push(0);}
    for(let x=0;x<4;x++){
      grid[y][x]=merged[x];
    }
    if(!rowsEqual(orig,merged)){moved=true;}
  }
  return moved;
}
function moveRight(){
  let moved=false;
  for(let y=0;y<4;y++){
    let orig = [grid[y][0],grid[y][1],grid[y][2],grid[y][3]];
    let arr = [];
    for(let x=3;x>=0;x--){
      if(orig[x]!==0){arr.push(orig[x]);}
    }
    let merged = [];
    let i=0;
    while(i<arr.length){
      if(i+1<arr.length && arr[i]===arr[i+1]){
        let val = arr[i]*2;
        score+=val;
        merged.push(val);
        i+=2;
      } else {
        merged.push(arr[i]);
        i+=1;
      }
    }
    while(merged.length<4){merged.push(0);}
    for(let x=3,idx=0;x>=0;x--,idx++){
      grid[y][x]=merged[idx];
    }
    let newRow = [grid[y][0],grid[y][1],grid[y][2],grid[y][3]];
    if(!rowsEqual(orig,newRow)){moved=true;}
  }
  return moved;
}
function moveUp(){
  let moved=false;
  for(let x=0;x<4;x++){
    let orig = [grid[0][x],grid[1][x],grid[2][x],grid[3][x]];
    let arr = [];
    for(let y=0;y<4;y++){
      if(orig[y]!==0){arr.push(orig[y]);}
    }
    let merged = [];
    let i=0;
    while(i<arr.length){
      if(i+1<arr.length && arr[i]===arr[i+1]){
        let val = arr[i]*2;
        score+=val;
        merged.push(val);
        i+=2;
      } else {
        merged.push(arr[i]);
        i+=1;
      }
    }
    while(merged.length<4){merged.push(0);}
    for(let y=0;y<4;y++){
      grid[y][x]=merged[y];
    }
    let newCol = [grid[0][x],grid[1][x],grid[2][x],grid[3][x]];
    if(!rowsEqual(orig,newCol)){moved=true;}
  }
  return moved;
}
function moveDown(){
  let moved=false;
  for(let x=0;x<4;x++){
    let orig = [grid[0][x],grid[1][x],grid[2][x],grid[3][x]];
    let arr = [];
    for(let y=3;y>=0;y--){
      if(orig[y]!==0){arr.push(orig[y]);}
    }
    let merged = [];
    let i=0;
    while(i<arr.length){
      if(i+1<arr.length && arr[i]===arr[i+1]){
        let val = arr[i]*2;
        score+=val;
        merged.push(val);
        i+=2;
      } else {
        merged.push(arr[i]);
        i+=1;
      }
    }
    while(merged.length<4){merged.push(0);}
    for(let y=3,idx=0;y>=0;y--,idx++){
      grid[y][x]=merged[idx];
    }
    let newCol = [grid[0][x],grid[1][x],grid[2][x],grid[3][x]];
    if(!rowsEqual(orig,newCol)){moved=true;}
  }
  return moved;
}
function canMove(){
  for(let y=0;y<4;y++){
    for(let x=0;x<4;x++){
      if(grid[y][x]===0){return true;}
    }
  }
  for(let y=0;y<4;y++){
    for(let x=0;x<3;x++){
      if(grid[y][x]===grid[y][x+1]){return true;}
    }
  }
  for(let x=0;x<4;x++){
    for(let y=0;y<3;y++){
      if(grid[y][x]===grid[y+1][x]){return true;}
    }
  }
  return false;
}
function setup(){
  createCanvas(400,400);
  sizeGrid = 4;
  tileSize = 100;
  score = 0;
  gameOver = false;
  initGrid();
  addRandomTwo();
  addRandomTwo();
  textAlign(CENTER,CENTER);
  textSize(32);
}
function draw(){
  background(250);
  stroke(200);
  for(let y=0;y<4;y++){
    for(let x=0;x<4;x++){
      let val = grid[y][x];
      if(val===0){
        fill(230);
      } else {
        let hue = 200 - Math.min(180, Math.log2(val)*20);
        fill(hue,100,200);
      }
      rect(x*tileSize,y*tileSize,tileSize-4,tileSize-4,8);
      if(val!==0){
        fill(0);
        text(String(val),x*tileSize+tileSize/2,y*tileSize+tileSize/2);
      }
    }
  }
  fill(0);
  textSize(16);
  text("Score: "+String(score),200,380);
  if(!gameOver && !canMove()){
    gameOver = true;
  }
  if(gameOver){
    fill(255,240,240,220);
    rect(0,0,width,height);
    fill(0);
    textSize(32);
    text("Game Over",200,180);
    textSize(20);
    text("Score: "+String(score),200,220);
    textSize(14);
    text("Press R to restart",200,250);
  }
}
function keyPressed(){
  if(keyCode===82){
    initGrid();
    addRandomTwo();
    addRandomTwo();
    score = 0;
    gameOver = false;
    return;
  }
  if(gameOver){return;}
  let moved=false;
  if(keyCode===LEFT_ARROW){
    moved = moveLeft();
  } else if(keyCode===RIGHT_ARROW){
    moved = moveRight();
  } else if(keyCode===UP_ARROW){
    moved = moveUp();
  } else if(keyCode===DOWN_ARROW){
    moved = moveDown();
  }
  if(moved){
    addRandomTwo();
    if(!canMove()){
      gameOver = true;
    }
  }
}
