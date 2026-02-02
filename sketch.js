let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerX = 20;
let playerY = 200;
let cpuX = canvasW - 20 - paddleW;
let cpuY = 200;
let playerSpeed = 6;
let cpuMaxSpeed = 5;
let ballX = 300;
let ballY = 200;
let ballR = 8;
let ballVX = 4;
let ballVY = 3;
let playerScore = 0;
let cpuScore = 0;
let cpuMissFrames = 0;
let cpuMissDuration = 30;
let cpuMissTargetY = 200;
let cpuMissProbPerFrame = 0.004;
function resetBall(direction){
  ballX = canvasW/2;
  ballY = canvasH/2;
  let dir = (direction === 0) ? ((random() < 0.5) ? 1 : -1) : (direction > 0 ? 1 : -1);
  ballVX = 4 * dir;
  ballVY = 3 * (random() < 0.5 ? 1 : -1);
}
function handleInput(){
  if(keyIsDown(UP_ARROW)){
    playerY -= playerSpeed;
  }
  if(keyIsDown(DOWN_ARROW)){
    playerY += playerSpeed;
  }
  let halfH = paddleH/2;
  playerY = constrain(playerY, halfH, canvasH - halfH);
}
function updateCPU(){
  if(cpuMissFrames <= 0){
    if(random() < cpuMissProbPerFrame){
      cpuMissFrames = cpuMissDuration;
      cpuMissTargetY = random(paddleH/2, canvasH - paddleH/2);
    }
  }
  let targetY = ballY;
  if(cpuMissFrames > 0){
    targetY = cpuMissTargetY;
    cpuMissFrames -= 1;
  }
  let dy = targetY - cpuY;
  if(abs(dy) > cpuMaxSpeed){
    cpuY += cpuMaxSpeed * (dy > 0 ? 1 : -1);
  } else {
    cpuY += dy;
  }
  cpuY = constrain(cpuY, paddleH/2, canvasH - paddleH/2);
}
function updateBall(){
  ballX += ballVX;
  ballY += ballVY;
  if(ballY - ballR <= 0){
    ballY = ballR;
    ballVY *= -1;
  }
  if(ballY + ballR >= canvasH){
    ballY = canvasH - ballR;
    ballVY *= -1;
  }
  if(ballX - ballR <= playerX + paddleW){
    if(ballY >= playerY - paddleH/2 && ballY <= playerY + paddleH/2){
      ballX = playerX + paddleW + ballR;
      ballVX = abs(ballVX);
      let relative = (ballY - playerY) / (paddleH/2);
      ballVY = relative * 5;
    }
  }
  if(ballX + ballR >= cpuX){
    if(ballY >= cpuY - paddleH/2 && ballY <= cpuY + paddleH/2){
      ballX = cpuX - ballR;
      ballVX = -abs(ballVX);
      let relative = (ballY - cpuY) / (paddleH/2);
      ballVY = relative * 5;
    }
  }
  if(ballX + ballR < 0){
    cpuScore += 1;
    resetBall(1);
  }
  if(ballX - ballR > canvasW){
    playerScore += 1;
    resetBall(-1);
  }
}
function setup(){
  createCanvas(canvasW, canvasH);
  playerY = canvasH/2;
  cpuY = canvasH/2;
  resetBall((random() < 0.5) ? 1 : -1);
  textSize(32);
  textAlign(CENTER, CENTER);
}
function draw(){
  background(0);
  stroke(255);
  strokeWeight(2);
  for(let i = 10; i < canvasH; i += 20){
    line(canvasW/2, i, canvasW/2, i+10);
  }
  noStroke();
  fill(255);
  rect(playerX, playerY - paddleH/2, paddleW, paddleH);
  rect(cpuX, cpuY - paddleH/2, paddleW, paddleH);
  fill(255, 204, 0);
  ellipse(ballX, ballY, ballR*2, ballR*2);
  handleInput();
  updateBall();
  updateCPU();
  fill(255);
  text(playerScore, canvasW*0.25, 30);
  text(cpuScore, canvasW*0.75, 30);
}
