let canvasW = 400;
let canvasH = 600;
let paddle = {w:90, h:12, x:canvasW/2, y:0};
let ball = {x:0, y:0, r:6, vx:4, vy:-5};
let blocks = [];
let particles = [];
let rows = 6;
let cols = 7;
let score = 0;
let playing = true;
let gameOver = false;
let gameCleared = false;
let blockColors = ['#ff595e','#ff9f1c','#ffca3a','#8ac926','#1982c4','#6a4c93'];
let blockW = 0;
let blockH = 18;
function createBlocks(){
  let marginX = 16;
  let gap = 6;
  blockW = (canvasW - marginX*2 - gap*(cols-1)) / cols;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      let bx = marginX + c*(blockW+gap);
      let by = 60 + r*(blockH+6);
      let b = {x:bx, y:by, w:blockW, h:blockH, col:blockColors[r%blockColors.length]};
      blocks.push(b);
    }
  }
}
function rectCircleCollision(cx, cy, cr, rx, ry, rw, rh){
  let nearestX = cx;
  if(nearestX < rx) nearestX = rx;
  if(nearestX > rx + rw) nearestX = rx + rw;
  let nearestY = cy;
  if(nearestY < ry) nearestY = ry;
  if(nearestY > ry + rh) nearestY = ry + rh;
  let dx = cx - nearestX;
  let dy = cy - nearestY;
  let dist2 = dx*dx + dy*dy;
  if(dist2 < cr*cr){
    let dist = Math.sqrt(dist2);
    let nx = 0;
    let ny = -1;
    if(dist > 0){
      nx = dx / dist;
      ny = dy / dist;
    }
    let overlap = cr - dist;
    return {collided:true, n:{x:nx,y:ny}, overlap:overlap, px:nearestX, py:nearestY};
  } else {
    return {collided:false};
  }
}
function reflectVelocity(vx, vy, nx, ny){
  let dot = vx*nx + vy*ny;
  let rvx = vx - 2*dot*nx;
  let rvy = vy - 2*dot*ny;
  return {vx:rvx, vy:rvy};
}
function generateParticles(x, y, color){
  for(let i=0;i<3;i++){
    let angle = random(-PI, PI);
    let speed = random(1, 3);
    let pvx = cos(angle)*speed;
    let pvy = sin(angle)*speed;
    let p = {x:x, y:y, vx:pvx, vy:pvy, life:15, col:color};
    particles.push(p);
  }
}
function setup(){
  createCanvas(canvasW, canvasH);
  paddle.y = height - 40;
  ball.x = width/2;
  ball.y = paddle.y - paddle.h/2 - ball.r - 2;
  ball.vx = 4;
  ball.vy = -5;
  createBlocks();
  textFont('Arial');
}
function draw(){
  background(30);
  noStroke();
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 12, 12);
  if(playing){
    paddle.x = constrain(mouseX, paddle.w/2, width - paddle.w/2);
    let prevVx = ball.vx;
    let prevVy = ball.vy;
    ball.x += ball.vx;
    ball.y += ball.vy;
    if(ball.x - ball.r <= 0){
      ball.x = ball.r;
      ball.vx *= -1;
    }
    if(ball.x + ball.r >= width){
      ball.x = width - ball.r;
      ball.vx *= -1;
    }
    if(ball.y - ball.r <= 0){
      ball.y = ball.r;
      ball.vy *= -1;
    }
    if(ball.y - ball.r > height){
      playing = false;
      gameOver = true;
    }
    let pRect = {x: paddle.x - paddle.w/2, y: paddle.y - paddle.h/2, w: paddle.w, h: paddle.h};
    let pc = rectCircleCollision(ball.x, ball.y, ball.r, pRect.x, pRect.y, pRect.w, pRect.h);
    if(pc.collided){
      let offset = (ball.x - paddle.x) / (paddle.w/2);
      if(offset < -1) offset = -1;
      if(offset > 1) offset = 1;
      let maxAngle = PI*3/8;
      let angle = offset * maxAngle;
      let speed = Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy);
      if(speed < 0.001) speed = 5;
      ball.vx = speed * Math.sin(angle);
      ball.vy = -Math.abs(speed * Math.cos(angle));
      ball.y = paddle.y - paddle.h/2 - ball.r - 0.1;
    }
    for(let i=blocks.length-1;i>=0;i--){
      let b = blocks[i];
      let bc = rectCircleCollision(ball.x, ball.y, ball.r, b.x, b.y, b.w, b.h);
      if(bc.collided){
        let refl = reflectVelocity(ball.vx, ball.vy, bc.n.x, bc.n.y);
        ball.vx = refl.vx;
        ball.vy = refl.vy;
        ball.x += bc.n.x * bc.overlap;
        ball.y += bc.n.y * bc.overlap;
        generateParticles(ball.x, ball.y, b.col);
        blocks.splice(i,1);
        score += 10;
        break;
      }
    }
    if(blocks.length === 0){
      playing = false;
      gameCleared = true;
    }
  }
  fill(200);
  rectMode(CENTER);
  rect(paddle.x, paddle.y, paddle.w, paddle.h, 4);
  fill(255, 200, 0);
  ellipse(ball.x, ball.y, ball.r*2, ball.r*2);
  for(let i=0;i<blocks.length;i++){
    let b = blocks[i];
    fill(b.col);
    rectMode(CORNER);
    rect(b.x, b.y, b.w, b.h, 4);
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.life -= 1;
    let alpha = map(p.life, 0, 15, 0, 255);
    if(alpha < 0) alpha = 0;
    fill(color(red(p.col), green(p.col), blue(p.col), alpha));
    ellipse(p.x, p.y, 6, 6);
    if(p.life <= 0){
      particles.splice(i,1);
    }
  }
  if(gameOver){
    fill(255, 80, 80);
    textAlign(CENTER, CENTER);
    textSize(36);
    text('GAME OVER', width/2, height/2 - 10);
    textSize(16);
    text('Score: ' + score, width/2, height/2 + 30);
  } else if(gameCleared){
    fill(120, 255, 160);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('YOU WIN!', width/2, height/2 - 10);
    textSize(16);
    text('Score: ' + score, width/2, height/2 + 30);
  }
}
