let canvasW = 400;
let canvasH = 600;
let paddleW = 90;
let paddleH = 12;
let paddleY = canvasH - 40;
let paddleX = 0;
let ballX = 0;
let ballY = 0;
let ballR = 6;
let ballVX = 4;
let ballVY = -5;
let ballSpeed = Math.sqrt(ballVX * ballVX + ballVY * ballVY);
let rows = 12;
let cols = 7;
let blocks = [];
let blockW = 0;
let blockH = 18;
let blockGap = 4;
let blockStartY = 40;
let colors = [];
let particles = [];
let score = 0;
let gameOver = false;
function setup() {
  createCanvas(canvasW, canvasH);
  paddleX = (canvasW - paddleW) / 2;
  ballX = canvasW / 2;
  ballY = paddleY - 30;
  blockW = (canvasW - (cols + 1) * blockGap) / cols;
  colors = [
    '#ff4d4d',
    '#ff944d',
    '#ffd24d',
    '#e6ff4d',
    '#b6ff4d',
    '#4dff88',
    '#4dd2ff',
    '#4da6ff',
    '#6b4dff',
    '#b84dff',
    '#ff4dd0',
    '#ff6b6b'
  ];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let bx = blockGap + c * (blockW + blockGap);
      let by = blockStartY + r * (blockH + blockGap);
      let b = {
        x: bx,
        y: by,
        w: blockW,
        h: blockH,
        col: colors[r % colors.length],
        row: r,
        colIndex: c
      };
      blocks.push(b);
    }
  }
  textAlign(LEFT, TOP);
  textSize(16);
  noStroke();
}
function draw() {
  background(30);
  if (!gameOver) {
    paddleX = constrain(mouseX - paddleW / 2, 0, canvasW - paddleW);
    let prevX = ballX;
    let prevY = ballY;
    ballX += ballVX;
    ballY += ballVY;
    if (ballX - ballR <= 0) {
      ballX = ballR;
      ballVX = Math.abs(ballVX);
    }
    if (ballX + ballR >= canvasW) {
      ballX = canvasW - ballR;
      ballVX = -Math.abs(ballVX);
    }
    if (ballY - ballR <= 0) {
      ballY = ballR;
      ballVY = Math.abs(ballVY);
    }
    if (ballY - ballR > canvasH) {
      gameOver = true;
    }
    let paddleTop = paddleY;
    let paddleLeft = paddleX;
    let paddleRight = paddleX + paddleW;
    if (prevY + ballR <= paddleTop && ballY + ballR >= paddleTop) {
      if (ballX >= paddleLeft && ballX <= paddleRight) {
        let relative = (ballX - (paddleLeft + paddleW / 2)) / (paddleW / 2);
        relative = constrain(relative, -1, 1);
        let maxAngle = Math.PI / 3;
        let angle = relative * maxAngle;
        let s = ballSpeed;
        ballVX = s * Math.sin(angle);
        ballVY = -Math.abs(s * Math.cos(angle));
        ballY = paddleTop - ballR;
      }
    }
    let collided = false;
    for (let i = blocks.length - 1; i >= 0; i--) {
      let b = blocks[i];
      let closestX = constrain(ballX, b.x, b.x + b.w);
      let closestY = constrain(ballY, b.y, b.y + b.h);
      let dx = ballX - closestX;
      let dy = ballY - closestY;
      if (dx * dx + dy * dy <= ballR * ballR) {
        blocks.splice(i, 1);
        score += 10;
        for (let p = 0; p < 3; p++) {
          let angle = random(0, Math.PI * 2);
          let speed = random(1, 3);
          let px = closestX;
          let py = closestY;
          let pvx = Math.cos(angle) * speed;
          let pvy = Math.sin(angle) * speed;
          let particle = { x: px, y: py, vx: pvx, vy: pvy, life: 15, col: b.col };
          particles.push(particle);
        }
        if (prevX < b.x || prevX > b.x + b.w) {
          ballVX = -ballVX;
        } else {
          ballVY = -ballVY;
        }
        collided = true;
        break;
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }
  fill(200);
  rect(paddleX, paddleY, paddleW, paddleH, 4);
  fill(255);
  ellipse(ballX, ballY, ballR * 2, ballR * 2);
  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i];
    fill(b.col);
    rect(b.x, b.y, b.w, b.h, 3);
  }
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let alpha = map(p.life, 0, 15, 0, 255);
    fill(colorAlpha(p.col, alpha));
    ellipse(p.x, p.y, 6, 6);
  }
  fill(255);
  text('Score: ' + score, 10, 10);
  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 200, 0);
    text('GAME OVER', canvasW / 2, canvasH / 2 - 20);
    textSize(16);
    fill(255);
    text('Refresh to play again', canvasW / 2, canvasH / 2 + 20);
    textAlign(LEFT, TOP);
    textSize(16);
  }
}
function colorAlpha(col, a) {
  let c = color(col);
  return 'rgba(' + Math.round(red(c)) + ',' + Math.round(green(c)) + ',' + Math.round(blue(c)) + ',' + (a / 255) + ')';
}
