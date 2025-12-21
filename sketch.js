let canvasW = 400;
let canvasH = 600;
let player = { x: canvasW / 2, y: canvasH - 40, r: 15, speed: 5 };
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
function initStars() {
  for (let i = 0; i < 30; i++) {
    let s = {
      x: Math.floor(Math.random() * canvasW),
      y: Math.floor(Math.random() * canvasH),
      sz: Math.floor(Math.random() * 3) + 1,
      vy: Math.random() * 2 + 1
    };
    stars.push(s);
  }
}
function spawnEnemies() {
  for (let i = 0; i < 10; i++) {
    let e = {
      x: Math.floor(Math.random() * (canvasW - 24)) + 12,
      y: -12,
      r: 12,
      vy: 8
    };
    enemies.push(e);
  }
}
function createBullet(x, y) {
  let b = {
    x: x,
    y: y,
    r: 300,
    vy: 70
  };
  bullets.push(b);
}
function createParticles(px, py) {
  for (let i = 0; i < 5; i++) {
    let angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 3 + 1;
    let p = {
      x: px,
      y: py,
      r: 3,
      life: 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    };
    particles.push(p);
  }
}
function setup() {
  createCanvas(canvasW, canvasH);
  initStars();
}
function draw() {
  background(0);
  fill(255);
  noStroke();
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    rect(s.x, s.y, s.sz, s.sz);
    s.y += s.vy;
    if (s.y > canvasH) {
      s.y = 0;
      s.x = Math.floor(Math.random() * canvasW);
      s.vy = Math.random() * 2 + 1;
    }
  }
  if (!gameOver) {
    if (keyIsDown(LEFT_ARROW)) {
      player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.x += player.speed;
    }
    if (player.x < player.r) {
      player.x = player.r;
    }
    if (player.x > canvasW - player.r) {
      player.x = canvasW - player.r;
    }
    if (frameCount % 60 === 0) {
      spawnEnemies();
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      b.y -= b.vy;
      if (b.y < -b.r) {
        bullets.splice(i, 1);
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      e.y += e.vy;
      if (e.y > canvasH + e.r) {
        enemies.splice(i, 1);
        continue;
      }
      let dPlayer = dist(e.x, e.y, player.x, player.y);
      if (dPlayer <= e.r + player.r) {
        gameOver = true;
      }
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      let hit = false;
      for (let j = enemies.length - 1; j >= 0; j--) {
        let e = enemies[j];
        let d = dist(b.x, b.y, e.x, e.y);
        if (d <= b.r + e.r) {
          createParticles(e.x, e.y);
          score += 1;
          enemies.splice(j, 1);
          bullets.splice(i, 1);
          hit = true;
          break;
        }
      }
      if (hit) {
        continue;
      }
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    fill(255, 150, 0);
    ellipse(p.x, p.y, p.r * 2, p.r * 2);
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  fill(0, 200, 255);
  noStroke();
  rectMode(CENTER);
  rect(player.x, player.y, player.r * 2, player.r * 2);
  fill(255, 0, 0);
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    ellipse(e.x, e.y, e.r * 2, e.r * 2);
  }
  fill(255);
  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    ellipse(b.x, b.y, 2, 2);
  }
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("SCORE: " + score, 10, 10);
  if (gameOver) {
    textSize(48);
    textAlign(CENTER, CENTER);
    text("GAME OVER", canvasW / 2, canvasH / 2);
  }
}
function keyPressed() {
  if (keyCode === 32 && !gameOver) {
    createBullet(player.x, player.y - player.r - 1);
  }
}
