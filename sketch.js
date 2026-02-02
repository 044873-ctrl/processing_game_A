let canvasWidth = 600;
let canvasHeight = 800;
let player = {
  x: 0,
  y: 0,
  w: 40,
  h: 20,
  speed: 6,
  lives: 3,
  lastShotFrame: -60,
  shotCooldown: 10
};
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;
let enemySpawnInterval = 60;
let lastEnemySpawnFrame = 0;
let enemySpeedMin = 1.5;
let enemySpeedMax = 3.0;
function clamp(val, a, b) {
  if (val < a) {
    return a;
  }
  if (val > b) {
    return b;
  }
  return val;
}
function rectIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
  return !(ax + aw < bx || bx + bw < ax || ay + ah < by || by + bh < ay);
}
function spawnEnemy() {
  let w = floor(random(24, 60));
  let h = floor(random(16, 36));
  let x = random(0, canvasWidth - w);
  let y = -h;
  let vy = random(enemySpeedMin, enemySpeedMax);
  let enemy = {
    x: x,
    y: y,
    w: w,
    h: h,
    vy: vy
  };
  enemies.push(enemy);
}
function resetGame() {
  bullets = [];
  enemies = [];
  score = 0;
  player.x = canvasWidth / 2 - player.w / 2;
  player.y = canvasHeight - 80;
  player.lives = 3;
  player.lastShotFrame = frameCount;
  gameOver = false;
  lastEnemySpawnFrame = frameCount;
}
function handleInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.x -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.x += player.speed;
  }
  player.x = clamp(player.x, 0, canvasWidth - player.w);
  if ((keyIsDown(32) || keyIsDown(75)) && frameCount - player.lastShotFrame >= player.shotCooldown && !gameOver) {
    player.lastShotFrame = frameCount;
    let bx = player.x + player.w / 2 - 4;
    let by = player.y - 8;
    let bullet = {
      x: bx,
      y: by,
      w: 8,
      h: 12,
      vy: -8
    };
    bullets.push(bullet);
  }
}
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.y += b.vy;
    if (b.y + b.h < 0) {
      bullets.splice(i, 1);
    }
  }
}
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.y += e.vy;
    if (e.y > canvasHeight) {
      enemies.splice(i, 1);
      player.lives -= 1;
      if (player.lives <= 0) {
        gameOver = true;
      }
    }
  }
}
function handleCollisions() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    if (rectIntersect(e.x, e.y, e.w, e.h, player.x, player.y, player.w, player.h)) {
      enemies.splice(i, 1);
      player.lives -= 1;
      if (player.lives <= 0) {
        gameOver = true;
      }
      continue;
    }
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      if (rectIntersect(e.x, e.y, e.w, e.h, b.x, b.y, b.w, b.h)) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        break;
      }
    }
  }
}
function drawHUD() {
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text(
