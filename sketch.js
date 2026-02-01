let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerX = 10;
let cpuX = canvasW - paddleW - 10;
let playerY = (canvasH - paddleH) / 2;
let cpuY = (canvasH - paddleH) / 2;
let playerSpeed = 6;
let cpuMaxSpeed = 5;
let ballR = 8;
let initialBallVX = 4;
let initialBallVY = 3;
let ballX = canvasW / 2;
let ballY = canvasH / 2;
let ballVX = initialBallVX;
let ballVY = initialBallVY;
let playerScore = 0;
let cpuScore = 0;
let cpuMissTimer = 0;
let cpuMissTargetY = 0;
let cpuMissChance = 0.01;
let cpuMissDuration = 30;
function resetBall() {
  ballX = canvasW / 2;
  ballY = canvasH / 2;
  ballVX = initialBallVX * (random() < 0.5 ? 1 : -1);
  ballVY = initialBallVY * (random() < 0.5 ? 1 : -1);
  cpuMissTimer = 0;
}
function setup() {
  createCanvas(canvasW, canvasH);
  textSize(32);
  textAlign(CENTER, TOP);
}
function draw() {
  background(0);
  stroke(255);
  for (let i = 10; i < canvasH; i += 20) {
    line(canvasW / 2, i, canvasW / 2, i + 10);
  }
  fill(255);
  noStroke();
  text(playerScore, canvasW * 0.25, 10);
  text(cpuScore, canvasW * 0.75, 10);
  if (keyIsDown(UP_ARROW)) {
    playerY -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    playerY += playerSpeed;
  }
  playerY = constrain(playerY, 0, canvasH - paddleH);
  if (cpuMissTimer > 0) {
    cpuMissTimer--;
    let target = cpuMissTargetY;
    let diff = target - cpuY;
    let move = constrain(diff, -cpuMaxSpeed, cpuMaxSpeed);
    cpuY += move;
  } else {
    if (ballVX > 0 && ballX > canvasW / 2) {
      if (random() < cpuMissChance) {
        cpuMissTimer = cpuMissDuration;
        cpuMissTargetY = random(0, canvasH - paddleH);
      }
    }
    let target = ballY - paddleH / 2;
    let diff = target - cpuY;
    let move = constrain(diff, -cpuMaxSpeed, cpuMaxSpeed);
    cpuY += move;
  }
  cpuY = constrain(cpuY, 0, canvasH - paddleH);
  ballX += ballVX;
  ballY += ballVY;
  if (ballY - ballR <= 0) {
    ballY = ballR;
    ballVY = -ballVY;
  }
  if (ballY + ballR >= canvasH) {
    ballY = canvasH - ballR;
    ballVY = -ballVY;
  }
  if (ballVX < 0) {
    if (ballX - ballR <= playerX + paddleW) {
      if (ballY >= playerY - ballR && ballY <= playerY + paddleH + ballR) {
        ballX = playerX + paddleW + ballR;
        ballVX = -ballVX;
        let offset = (ballY - (playerY + paddleH / 2)) / (paddleH / 2);
        ballVY = offset * 5;
      }
    }
  } else if (ballVX > 0) {
    if (ballX + ballR >= cpuX) {
      if (ballY >= cpuY - ballR && ballY <= cpuY + paddleH + ballR) {
        ballX = cpuX - ballR;
        ballVX = -ballVX;
        let offset = (ballY - (cpuY + paddleH / 2)) / (paddleH / 2);
        ballVY = offset * 5;
      }
    }
  }
  if (ballX - ballR > canvasW) {
    playerScore++;
    resetBall();
  }
  if (ballX + ballR < 0) {
    cpuScore++;
    resetBall();
  }
  fill(255);
  rect(playerX, playerY, paddleW, paddleH);
  rect(cpuX, cpuY, paddleW, paddleH);
  ellipse(ballX, ballY, ballR * 2, ballR * 2);
}
