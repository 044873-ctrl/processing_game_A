let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
function spawnEnemy() {
  let e = {
    x: random(12, width - 12),
    y: -12,
    r: 12,
    vy: 8
  };
  enemies.push(e);
}
function spawnBullet() {
  let b = {
    x: player.x,
    y: player.y,
    r: 200,
    vy: -70
  };
  bullets.push(b);
}
function spawnParticles(x, y) {
  for (let i = 0; i < 5; i++) {
    let angle = random(0, TWO_PI);
    let speed = random(1, 4);
    let p = {
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      r: 3,
      life: 20
    };
    particles.push(p);
  }
}
function setup() {
  createCanvas(400, 600);
  player = {
    x: width / 2,
    y: height - 30,
    r: 16,
    speed: 5
  };
  for (let i = 0; i < 30; i++) {
    let s = {
      x: random(0, width),
      y: random(0, height),
      r: random(1, 3),
      vy: random(0.5, 2)
    };
    stars.push(s);
  }
  score = 0;
  gameOver = false;
}
function draw() {
  background(0);
  fill(255);
  noStroke();
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    ellipse(s.x, s.y, s.r, s.r);
    s.y += s.vy;
    if (s.y > height) {
      s.y = random(-height, 0);
      s.x = random(0, width);
      s.vy = random(0.5, 2);
      s.r = random(1, 3);
    }
  }
  if (!gameOver && frameCount % 60 === 0) {
    spawnEnemy();
  }
  if (!gameOver) {
    if (keyIsDown(LEFT_ARROW)) {
      player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
  }
  fill(0, 200, 255);
  ellipse(player.x, player.y, player.r * 2, player.r * 2);
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    if (!gameOver) {
      b.y += b.vy;
    }
    fill(255, 255, 0, 200);
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
    if (b.y + b.r < 0) {
      bullets.splice(i, 1);
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    if (!gameOver) {
      e.y += e.vy;
    }
    fill(255, 100, 100);
    ellipse(e.x, e.y, e.r * 2, e.r * 2);
    let dPlayer = dist(e.x, e.y, player.x, player.y);
    if (!gameOver && dPlayer <= e.r + player.r) {
      gameOver = true;
    }
    let destroyed = false;
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      let d = dist(e.x, e.y, b.x, b.y);
      if (d <= e.r + b.r) {
        spawnParticles(e.x, e.y);
        bullets.splice(j, 1);
        enemies.splice(i, 1);
        score += 1;
        destroyed = true;
        break;
      }
    }
    if (destroyed) {
      continue;
    }
    if (e.y - e.r > height) {
      enemies.splice(i, 1);
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    fill(255, 180, 0, map(p.life, 0, 20, 0, 255));
    ellipse(p.x, p.y, p.r * 2, p.r * 2);
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("SCORE: " + score, 10, 10);
  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(32);
    text("GAME OVER", width / 2, height / 2);
  }
}
function keyPressed() {
  if (!gameOver && (key === ' ' || keyCode === 32)) {
    spawnBullet();
  }
  if (gameOver && (key === 'r' || key === 'R')) {
    bullets = [];
    enemies = [];
    particles = [];
    stars = [];
    for (let i = 0; i < 30; i++) {
      let s = {
        x: random(0, width),
        y: random(0, height),
        r: random(1, 3),
        vy: random(0.5, 2)
      };
      stars.push(s);
    }
    player.x = width / 2;
    score = 0;
    gameOver = false;
  }
}
