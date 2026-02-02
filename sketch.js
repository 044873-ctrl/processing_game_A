let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerX = 10;
let cpuX = canvasW - 10 - paddleW;
let playerY = 0;
let cpuY = 0;
let playerSpeed = 6;
let cpuMaxSpeed = 5;
let cpuMissTimer = 0;
let cpuTargetY = 0;
let cpuMissChance = 0.004;
let ball = {x:0,y:0,vx:4,vy:3,r:8};
let playerScore = 0;
let cpuScore = 0;
function setup(){
  createCanvas(canvasW,canvasH);
  playerY = (canvasH - paddleH)/2;
  cpuY = (canvasH - paddleH)/2;
  resetBall(1);
  textSize(32);
  textAlign(CENTER,CENTER);
}
function draw(){
  background(0);
  handleInput();
  updateCPU();
  updateBall();
  drawMiddleLine();
  drawPaddles();
  drawBall();
  drawScores();
}
function handleInput(){
  if(keyIsDown(UP_ARROW)){
    playerY -= playerSpeed;
  }
  if(keyIsDown(DOWN_ARROW)){
    playerY += playerSpeed;
  }
  if(playerY < 0){
    playerY = 0;
  }
  if(playerY > canvasH - paddleH){
    playerY = canvasH - paddleH;
  }
}
function updateCPU(){
  if(cpuMissTimer > 0){
    cpuMissTimer--;
    let desiredY = cpuTargetY - paddleH/2;
    let dy = desiredY - cpuY;
    if(abs(dy) <= cpuMaxSpeed){
      cpuY = desiredY;
    } else {
      cpuY += cpuMaxSpeed * (dy > 0 ? 1 : -1);
    }
  } else {
    if(ball.vx > 0 && random() < cpuMissChance){
      cpuMissTimer = 30;
      cpuTargetY = random(paddleH/2, canvasH - paddleH/2);
      let desiredY = cpuTargetY - paddleH/2;
      let dy = desiredY - cpuY;
      if(abs(dy) <= cpuMaxSpeed){
        cpuY = desiredY;
      } else {
        cpuY += cpuMaxSpeed * (dy > 0 ? 1 : -1);
      }
    } else {
      let desiredY = ball.y - paddleH/2;
      let dy = desiredY - cpuY;
      if(abs(dy) <= cpuMaxSpeed){
        cpuY = desiredY;
      } else {
        cpuY += cpuMaxSpeed * (dy > 0 ? 1 : -1);
      }
    }
  }
  if(cpuY < 0){
    cpuY = 0;
  }
  if(cpuY > canvasH - paddleH){
    cpuY = canvasH - paddleH;
  }
}
function updateBall(){
  ball.x += ball.vx;
  ball.y += ball.vy;
  if(ball.y - ball.r <= 0){
    ball.y = ball.r;
    ball.vy = -ball.vy;
  }
  if(ball.y + ball.r >= canvasH){
    ball.y = canvasH - ball.r;
    ball.vy = -ball.vy;
  }
  if(ball.x - ball.r <= playerX + paddleW && ball.x - ball.r >= playerX){
    if(ball.y >= playerY && ball.y <= playerY + paddleH){
      ball.x = playerX + paddleW + ball.r;
      ball.vx = abs(ball.vx);
      let diff = ball.y - (playerY + paddleH/2);
      let normalized = diff / (paddleH/2);
      ball.vy = ball.vy + normalized * 3;
    }
  }
  if(ball.x + ball.r >= cpuX && ball.x + ball.r <= cpuX + paddleW){
    if(ball.y >= cpuY && ball.y <= cpuY + paddleH){
      ball.x = cpuX - ball.r;
      ball.vx = -abs(ball.vx);
      let diff = ball.y - (cpuY + paddleH/2);
      let normalized = diff / (paddleH/2);
      ball.vy = ball.vy + normalized * 3;
    }
  }
  if(ball.x < 0){
    cpuScore += 1;
    resetBall(-1);
  }
  if(ball.x > canvasW){
    playerScore += 1;
    resetBall(1);
  }
}
function resetBall(dir){
  ball.x = canvasW/2;
  ball.y = canvasH/2;
  ball.vx = 4 * dir;
  ball.vy = 3 * (random() < 0.5 ? 1 : -1);
}
function drawPaddles(){
  fill(255);
  rect(playerX,playerY,paddleW,paddleH);
  rect(cpuX,cpuY,paddleW,paddleH);
}
function drawBall(){
  ellipse(ball.x,ball.y,ball.r*2,ball.r*2);
}
function drawMiddleLine(){
  stroke(255);
  for(let y = 0; y < canvasH; y += 20){
    line(canvasW/2, y, canvasW/2, y+10);
  }
  noStroke();
}
function drawScores(){
  fill(255);
  text(playerScore, canvasW*0.25, 30);
  text(cpuScore, canvasW*0.75, 30);
}
