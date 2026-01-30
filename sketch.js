let player;
let bullets;
let enemies;
let enemySpawnTimer;
let enemySpawnInterval;
let score;
let lives;
let gameState;
let fireCooldown;
let lastMousePressed;
function setup(){
  createCanvas(480,640);
  player = {
    x: width/2,
    y: height - 40,
    w: 40,
    h: 12,
    speed: 5,
    fireTimer: 0
  };
  bullets = [];
  enemies = [];
  enemySpawnInterval = 60;
  enemySpawnTimer = enemySpawnInterval;
  score = 0;
  lives = 3;
  gameState = "play";
  fireCooldown = 10;
  lastMousePressed = false;
  textSize(18);
  noStroke();
}
function draw(){
  background(18,24,34);
  if(gameState === "play"){
    updatePlayer();
    updateBullets();
    spawnEnemies();
    updateEnemies();
    checkCollisions();
    if(lives <= 0){
      gameState = "gameover";
    }
  } else if(gameState === "gameover"){
    fill(255);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2 - 20);
    text("Score: " + score, width/2, height/2 + 6);
    text(
