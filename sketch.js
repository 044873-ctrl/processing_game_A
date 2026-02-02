let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerSpeed = 6;
let cpuMaxSpeed = 5;
let ballR = 8;
let initialBallVX = 4;
let initialBallVY = 3;
let cpuMissDuration = 30;
let cpuMissChancePerFrame = 0.005;
let player = {
  x: 20,
  y: 200,
  w: paddleW,
  h: paddleH,
  speed: playerSpeed
};
let cpu = {
  x: canvasW - 20,
  y: 200,
  w: paddleW,
  h: paddleH,
  maxSpeed: cpuMaxSpeed,
  missFramesLeft: 0,
  missTargetY: 200
};
let ball = {
  x: canvasW / 2,
  y: canvasH / 2,
  vx: initialBallVX,
  vy: initialBallVY,
  r: ballR
};
let scoreLeft = 0;
let scoreRight = 0;
function setup(){
  createCanvas(canvasW, canvasH);
  rectMode(CENTER);
  textAlign(CENTER, TOP);
  textSize(32);
}
function resetBall(){
  ball.x = canvasW / 2;
  ball.y = canvasH / 2;
  ball.vx = initialBallVX * (random() < 0.5 ? 1 : -1);
  ball.vy = initialBallVY * (random() < 0.5 ? 1 : -1);
}
function clamp(v, a, b){
  if(v < a) return a;
  if(v > b) return b;
  return v;
}
function draw(){
  background(20);
  fill(255);
  noStroke();
  text(scoreLeft, canvasW * 0.25, 10);
  text(scoreRight, canvasW * 0.75, 10);
  if(keyIsDown(UP_ARROW)){
    player.y -= player.speed;
  }
  if(keyIsDown(DOWN_ARROW)){
    player.y += player.speed;
  }
  player.y = clamp(player.y, player.h / 2, canvasH - player.h / 2);
  if(cpu.missFramesLeft <= 0){
    if(ball.vx > 0 && random() < cpuMissChancePerFrame){
      cpu.missFramesLeft = cpuMissDuration;
      cpu.missTargetY = random(cpu.h / 2, canvasH - cpu.h / 2);
    }
  }
  let cpuTargetY = ball.y;
  if(cpu.missFramesLeft > 0){
    cpuTargetY = cpu.missTargetY;
    cpu.missFramesLeft -= 1;
  }
  let dy = cpuTargetY - cpu.y;
  if(dy > cpu.maxSpeed) dy = cpu.maxSpeed;
  if(dy < -cpu.maxSpeed) dy = -cpu.maxSpeed;
  cpu.y += dy;
  cpu.y = clamp(cpu.y, cpu.h / 2, canvasH - cpu.h / 2);
  ball.x += ball.vx;
  ball.y += ball.vy;
  if(ball.y - ball.r < 0){
    ball.y = ball.r;
    ball.vy = -ball.vy;
  }
  if(ball.y + ball.r > canvasH){
    ball.y = canvasH - ball.r;
    ball.vy = -ball.vy;
  }
  if(ball.x - ball.r > canvasW){
    scoreLeft += 1;
    resetBall();
  }
  if(ball.x + ball.r < 0){
    scoreRight += 1;
    resetBall();
  }
  let dxPlayer = abs(ball.x - player.x);
  let dyPlayer = abs(ball.y - player.y);
  if(ball.vx < 0 && dxPlayer <= (player.w / 2 + ball.r) && dyPlayer <= (player.h / 2 + ball.r)){
    ball.x = player.x + (player.w / 2 + ball.r);
    ball.vx = -ball.vx;
    let relative = (ball.y - player.y) / (player.h / 2);
    relative = clamp(relative, -1, 1);
    ball.vy = relative * 6;
  }
  let dxCpu = abs(ball.x - cpu.x);
  let dyCpu = abs(ball.y - cpu.y);
  if(ball.vx > 0 && dxCpu <= (cpu.w / 2 + ball.r) && dyCpu <= (cpu.h / 2 + ball.r)){
    ball.x = cpu.x - (cpu.w / 2 + ball.r);
    ball.vx = -ball.vx;
    let relative = (ball.y - cpu.y) / (cpu.h / 2);
    relative = clamp(relative, -1, 1);
    ball.vy = relative * 6;
  }
  fill(255);
  rect(player.x, player.y, player.w, player.h);
  rect(cpu.x, cpu.y, cpu.w, cpu.h);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
}
