let PLAYER_SPEED = 5;
let PLAYER_RADIUS = 16;
let BULLET_RADIUS = 8;
let BULLET_SPEED = 50;
let ENEMY_RADIUS = 12;
let ENEMY_SPEED = 2;
let PARTICLE_COUNT = 5;
let PARTICLE_RADIUS = 3;
let PARTICLE_LIFE = 20;
let STAR_COUNT = 30;
let WIDTH = 400;
let HEIGHT = 600;
let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;

function createStar() {
  let s = {
    x: random(0, WIDTH),
    y: random(0, HEIGHT),
    r: random(1, 3),
    speed: random(0.5, 2)
  };
  return s;
}

function spawnEnemy() {
  let e = {
    x: random(ENEMY_RADIUS, WIDTH - ENEMY_RADIUS),
    y: -ENEMY_RADIUS,
    r: ENEMY_RADIUS,
    vy: ENEMY_SPEED
  };
  enemies.push(e);
}

function spawnBullet() {
  let b = {
    x: player.x,
    y: player.y - player.r - BULLET_RADIUS,
    r: BULLET_RADIUS,
    vy: -BULLET_SPEED
  };
  bullets.push(b);
}

function createParticles(x, y) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    let angle = random(0, TWO_PI);
    let speed = random(1, 4);
    let p = {
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      r: PARTICLE_RADIUS,
      life: PARTICLE_LIFE
    };
    particles.push(p);
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  player = {
    x: WIDTH / 2,
    y: HEIGHT - 40,
    r: PLAYER_RADIUS
  };
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(createStar());
  }
  textSize(16);
  textAlign(LEFT, TOP);
  noStroke();
}

function draw() {
  background(0);
  fill(255);
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    ellipse(s.x, s.y, s.r * 2, s.r * 2);
    s.y += s.speed;
    if (s.y > HEIGHT + s.r) {
      s.y = random(-20, 0);
      s.x = random(0, WIDTH);
      s.r = random(1, 3);
      s.speed = random(0.5, 2);
    }
  }
  if (!gameOver) {
    if (keyIsDown(LEFT_ARROW)) {
      player.x -= PLAYER_SPEED;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.x += PLAYER_SPEED;
    }
    player.x = constrain(player.x, player.r, WIDTH - player.r);
    if (frameCount % 60 === 0) {
      spawnEnemy();
    }
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.y += b.vy;
    if (b.y < -b.r) {
      bullets.splice(i, 1);
      continue;
    }
    fill(200, 200, 255);
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.y += e.vy;
    if (e.y > HEIGHT + e.r) {
      enemies.splice(i, 1);
      continue;
    }
    fill(255, 100, 100);
    ellipse(e.x, e.y, e.r * 2, e.r * 2);
    if (!gameOver) {
      let d = dist(player.x, player.y, e.x, e.y);
      if (d <= player.r + e.r) {
        createParticles(e.x, e.y);
        gameOver = true;
        noLoop();
      }
    }
    let hit = false;
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      let dbe = dist(b.x, b.y, e.x, e.y);
      if (dbe <= b.r + e.r) {
        createParticles(e.x, e.y);
        bullets.splice(j, 1);
        enemies.splice(i, 1);
        score += 1;
        hit = true;
        break;
      }
    }
    if (hit) {
      continue;
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = map(p.life, 0, PARTICLE_LIFE, 0, 255);
    fill(255, 200, 50, alpha);
    ellipse(p.x, p.y, p.r * 2, p.r * 2);
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  fill(100, 200, 255);
  ellipse(player.x, player.y, player.r * 2, player.r * 2);
  fill(255);
  text("SCORE: " + score, 8, 8);
  if (gameOver) {
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("GAME OVER", WIDTH / 2, HEIGHT / 2);
  }
}

function keyPressed() {
  if (keyCode === 32 && !gameOver) {
    spawnBullet();
  }
}
