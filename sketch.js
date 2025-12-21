let COLS=10;
let ROWS=20;
let CELL=30;
let canvasW=COLS*CELL;
let canvasH=ROWS*CELL;
let grid=[];
let shapes=[];
let colorsArr=[];
let currentPiece=null;
let tick=0;
let dropInterval=30;
let score=0;
let gameOver=false;
function setup(){
  createCanvas(canvasW,canvasH);
  for(let r=0;r<ROWS;r++){
    let row=[];
    for(let c=0;c<COLS;c++){
      row.push(0);
    }
    grid.push(row);
  }
  shapes.push([[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]);
  shapes.push([[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]);
  shapes.push([[0,0,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]]);
  shapes.push([[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]]);
  shapes.push([[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]]);
  shapes.push([[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]]);
  shapes.push([[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]]);
  colorsArr.push(color(0,255,255));
  colorsArr.push(color(255,255,0));
  colorsArr.push(color(128,0,128));
  colorsArr.push(color(255,165,0));
  colorsArr.push(color(0,0,255));
  colorsArr.push(color(0,255,0));
  colorsArr.push(color(255,0,0));
  spawnPiece();
  textSize(16);
  noStroke();
}
function draw(){
  background(30);
  drawGrid();
  if(!gameOver){
    tick++;
    if(keyIsDown(DOWN_ARROW)){
      if(canMove(0,1,currentPiece.matrix)){
        currentPiece.y+=1;
      }else{
        lockPiece();
      }
      tick=0;
    }else{
      if(tick>=dropInterval){
        if(canMove(0,1,currentPiece.matrix)){
          currentPiece.y+=1;
        }else{
          lockPiece();
        }
        tick=0;
      }
    }
  }
  drawCurrent();
  fill(255);
  text("Score: "+score,8,18);
  if(gameOver){
    fill(0,0,0,150);
    rect(0,0,canvasW,canvasH);
    fill(255);
    textSize(32);
    text("GAME OVER",30,canvasH/2-10);
    textSize(16);
    text("Score: "+score,canvasW/2-30,canvasH/2+20);
  }
}
function drawGrid(){
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      let v=grid[r][c];
      if(v===0){
        fill(50);
      }else{
        fill(colorsArr[(v-1+colorsArr.length)%colorsArr.length]);
      }
      rect(c*CELL,r*CELL,CELL-1,CELL-1);
    }
  }
}
function drawCurrent(){
  if(currentPiece===null){return;}
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      if(currentPiece.matrix[r][c]){
        let gx=(currentPiece.x+c)*CELL;
        let gy=(currentPiece.y+r)*CELL;
        fill(colorsArr[(currentPiece.colorIndex+colorsArr.length)%colorsArr.length]);
        rect(gx,gy,CELL-1,CELL-1);
      }
    }
  }
}
function spawnPiece(){
  let idx=floor(random(0,shapes.length));
  let mat=copyMatrix(shapes[idx]);
  let px=floor((COLS-4)/2);
  let py=0;
  currentPiece={x:px,y:py,matrix:mat,colorIndex:idx+1};
  if(!canPlace(currentPiece.matrix,currentPiece.x,currentPiece.y)){
    gameOver=true;
  }
}
function copyMatrix(m){
  let out=[];
  for(let r=0;r<4;r++){
    let row=[];
    for(let c=0;c<4;c++){
      row.push(m[r][c]);
    }
    out.push(row);
  }
  return out;
}
function canPlace(matrix,x,y){
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      if(matrix[r][c]){
        let gx=x+c;
        let gy=y+r;
        if(gx<0||gx>=COLS||gy<0||gy>=ROWS){return false;}
        if(grid[gy][gx]!==0){return false;}
      }
    }
  }
  return true;
}
function canMove(dx,dy,matrix){
  return canPlace(matrix,currentPiece.x+dx,currentPiece.y+dy);
}
function lockPiece(){
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      if(currentPiece.matrix[r][c]){
        let gx=currentPiece.x+c;
        let gy=currentPiece.y+r;
        if(gy>=0&&gy<ROWS&&gx>=0&&gx<COLS){
          grid[gy][gx]=currentPiece.colorIndex;
        }
      }
    }
  }
  clearLines();
  spawnPiece();
}
function clearLines(){
  let linesCleared=0;
  for(let r=ROWS-1;r>=0;r--){
    let full=true;
    for(let c=0;c<COLS;c++){
      if(grid[r][c]===0){full=false;break;}
    }
    if(full){
      grid.splice(r,1);
      let newRow=[];
      for(let c=0;c<COLS;c++){newRow.push(0);}
      grid.unshift(newRow);
      linesCleared++;
      r++;
    }
  }
  if(linesCleared>0){
    score+=linesCleared*100;
  }
}
function rotateMatrix(m){
  let out=[];
  for(let r=0;r<4;r++){
    let row=[];
    for(let c=0;c<4;c++){
      row.push(0);
    }
    out.push(row);
  }
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      out[c][3-r]=m[r][c];
    }
  }
  return out;
}
function keyPressed(){
  if(gameOver){return;}
  if(keyCode===LEFT_ARROW){
    if(canMove(-1,0,currentPiece.matrix)){
      currentPiece.x-=1;
    }
  }else if(keyCode===RIGHT_ARROW){
    if(canMove(1,0,currentPiece.matrix)){
      currentPiece.x+=1;
    }
  }else if(keyCode===UP_ARROW){
    let rm=rotateMatrix(currentPiece.matrix);
    if(canPlace(rm,currentPiece.x,currentPiece.y)){
      currentPiece.matrix=rm;
    }
  }else if(keyCode===DOWN_ARROW){
    if(canMove(0,1,currentPiece.matrix)){
      currentPiece.y+=1;
    }else{
      lockPiece();
    }
    tick=0;
  }
}
