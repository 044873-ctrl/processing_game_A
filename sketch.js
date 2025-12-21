let playerX;
let playerY;
let playerSpeed;
let playerRadius;
let bullets;
let enemies;
let particles;
let stars;
let spawnTimer;
let score;
let gameOver;
let fireCooldown;
let FIRE_COOLDOWN_MAX;
function collideCircles(ax,ay,ar,bx,by,br){
  let dx = ax-bx;
  let dy = ay-by;
  let dist2 = dx*dx+dy*dy;
  let rsum = ar+br;
  return dist2 <= rsum*rsum;
}
function setup(){
  createCanvas(400,600);
  playerRadius = 20;
  playerSpeed = 5;
  playerX = width/2;
  playerY = height - 40;
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  for(let i=0;i<30;i++){
    let s = {
      x: random(0,width),
      y: random(0,height),
      size: random(1,3),
      speed: random(1,3)
    };
    stars.push(s);
  }
  spawnTimer = 0;
  score = 0;
  gameOver = false;
  fireCooldown = 0;
  FIRE_COOLDOWN_MAX = 8;
  textSize(18);
  textAlign(LEFT,TOP);
}
function draw(){
  background(0);
  for(let si=stars.length-1;si>=0;si--){
    let s = stars[si];
    fill(255);
    noStroke();
    circle(s.x,s.y,s.size);
    s.y += s.speed;
    if(s.y>height){
      s.y = random(-height,0);
      s.x = random(0,width);
      s.size = random(1,3);
      s.speed = random(1,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      playerX -= playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      playerX += playerSpeed;
    }
    playerX = constrain(playerX,playerRadius,width-playerRadius);
    if(fireCooldown>0){
      fireCooldown--;
    }
    if(keyIsDown(32) && fireCooldown<=0){
      let b = {
        x: playerX,
        y: playerY - playerRadius - 30,
        r: 30,
        vy: -70
      };
      bullets.push(b);
      fireCooldown = FIRE_COOLDOWN_MAX;
    }
    spawnTimer++;
    if(spawnTimer>=60){
      spawnTimer = 0;
      let e = {
        x: random(12,width-12),
        y: -12,
        r: 12,
        vy: 8
      };
      enemies.push(e);
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y += b.vy;
      if(b.y + b.r < 0){
        bullets.splice(i,1);
        continue;
      }
      let hitBullet = false;
      for(let j=enemies.length-1;j>=0;j--){
        let e = enemies[j];
        if(collideCircles(b.x,b.y,b.r,e.x,e.y,e.r)){
          enemies.splice(j,1);
          hitBullet = true;
          score += 1;
          for(let pcount=0;pcount<5;pcount++){
            let angle = random(0,TWO_PI);
            let speed = random(1,4);
            let p = {
              x: e.x,
              y: e.y,
              r: 3,
              vx: cos(angle)*speed,
              vy: sin(angle)*speed,
              life: 20
            };
            particles.push(p);
          }
          break;
        }
      }
      if(hitBullet){
        bullets.splice(i,1);
      }
    }
    for(let ei=enemies.length-1;ei>=0;ei--){
      let e = enemies[ei];
      e.y += e.vy;
      if(e.y - e.r > height){
        enemies.splice(ei,1);
        continue;
      }
      if(collideCircles(e.x,e.y,e.r,playerX,playerY,playerRadius)){
        gameOver = true;
      }
    }
    for(let pi=particles.length-1;pi>=0;pi--){
      let p = particles[pi];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if(p.life<=0){
        particles.splice(pi,1);
      }
    }
  }
  fill(0,0,255);
  noStroke();
  circle(playerX,playerY,playerRadius*2);
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    fill(255,200,0);
    noStroke();
    circle(b.x,b.y,b.r*2);
  }
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    fill(255,0,0);
    noStroke();
    circle(e.x,e.y,e.r*2);
  }
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    fill(255,150,0, map(p.life,0,20,0,255));
    noStroke();
    circle(p.x,p.y,p.r*2);
  }
  fill(255);
  text("Score: "+score,10,10);
  if(gameOver){
    fill(255,0,0);
    textSize(36);
    textAlign(CENTER,CENTER);
    text("GAME OVER",width/2,height/2);
  }
}
