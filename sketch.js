let player;
let bullets;
let asteroids;
let spawnInterval;
let spawnTimer;
let score;
let lives;
let gameState;
let shootCooldown;
let shootTimer;
function setup() {
  createCanvas(600, 400);
  resetGame();
  frameRate(60);
}
function resetGame() {
  player = {
    x: width / 2,
    y: height - 30,
    w: 40,
    h: 20,
    speed: 5
  };
  bullets = [];
  asteroids = [];
  spawnInterval = 1000;
  spawnTimer = 0;
  score = 0;
  lives = 3;
  gameState = 'playing';
  shootCooldown = 300;
  shootTimer = 0;
}
function draw() {
  background(20);
  fill(255);
  if (gameState === 'playing') {
    handleInput();
    updateBullets();
    updateAsteroids();
    handleCollisions();
    spawnTimer += deltaTime;
    if (spawnTimer >= spawnInterval) {
      spawnTimer = 0;
      spawnAsteroid();
    }
  }
  drawPlayer();
  drawBullets();
  drawAsteroids();
  drawHUD();
  if (gameState === 'gameover') {
    fill(255, 50, 50);
    textSize(36);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width / 2, height / 2 - 20);
    textSize(16);
    text('Press R to Restart', width / 2, height / 2 + 18);
  }
  if (shootTimer > 0) {
    shootTimer -= deltaTime;
    if (shootTimer < 0) {
      shootTimer = 0;
    }
  }
}
function handleInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.x -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.x += player.speed;
  }
  if (player.x < player.w / 2) {
    player.x = player.w / 2;
  }
  if (player.x > width - player.w / 2) {
    player.x = width - player.w / 2;
  }
  if ((keyIsDown(32) || keyIsDown(87)) && shootTimer === 0) {
    shootBullet();
    shootTimer = shootCooldown;
  }
}
function shootBullet() {
  let b = {
    x: player.x,
    y: player.y - player.h / 2 - 5,
    vy: -7,
    r: 4
  };
  bullets.push(b);
}
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.y += b.vy;
    if (b.y < -10) {
      bullets.splice(i, 1);
    }
  }
}
function spawnAsteroid() {
  let size = Math.floor(random(20, 60));
  let a = {
    x: random(size / 2, width - size / 2),
    y: -size / 2,
    vy: random(1.5, 3.5),
    size: size
  };
  asteroids.push(a);
}
function updateAsteroids() {
  for (let i = asteroids.length - 1; i >= 0; i--) {
    let a = asteroids[i];
    a.y += a.vy;
    if (a.y > height + a.size) {
      asteroids.splice(i, 1);
      continue;
    }
  }
}
function handleCollisions() {
  for (let i = asteroids.length - 1; i >= 0; i--) {
    let a = asteroids[i];
    let ar = a.size / 2;
    let px = player.x;
    let py = player.y;
    let pr = Math.max(player.w, player.h) / 2;
    let dxp = a.x - px;
    let dyp = a.y - py;
    let dist2p = dxp * dxp + dyp * dyp;
    let rsump = ar + pr;
    if (dist2p <= rsump * rsump) {
      asteroids.splice(i, 1);
      lives -= 1;
      if (lives <= 0) {
        gameState = 'gameover';
      }
      continue;
    }
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      let dxb = a.x - b.x;
      let dyb = a.y - b.y;
      let dist2b = dxb * dxb + dyb * dyb;
      let rsum = ar + b.r;
      if (dist2b <= rsum * rsum) {
        asteroids.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        break;
      }
    }
  }
}
function drawPlayer() {
  fill(100, 200, 255);
  rectMode(CENTER);
  rect(player.x, player.y, player.w, player.h, 4);
  triangle(player.x - player.w / 2, player.y, player.x - player.w / 2 - 8, player.y + player.h / 2, player.x - player.w / 2, player.y + player.h / 2);
  triangle(player.x + player.w / 2, player.y, player.x + player.w / 2 + 8, player.y + player.h / 2, player.x + player.w / 2, player.y + player.h / 2);
}
function drawBullets() {
  fill(255, 220, 100);
  noStroke();
  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
  }
}
function drawAsteroids() {
  fill(255, 0, 0);
  stroke(180, 0, 0);
  for (let i = 0; i < asteroids.length; i++) {
    let a = asteroids[i];
    ellipse(a.x, a.y, a.size, a.size);
  }
  noStroke();
}
function drawHUD() {
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 8, 8);
  text('Lives: ' + lives, 8, 28);
}
function keyPressed() {
  if (gameState === 'gameover' && (key === 'r' || key === 'R')) {
    resetGame();
  }
}
