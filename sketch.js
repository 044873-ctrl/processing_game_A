let canvasW = 400;
let canvasH = 600;
let paddleW = 90;
let paddleH = 12;
let paddleX = 0;
let paddleY = 0;
let ball = {
  x: 0,
  y: 0,
  r: 6,
  vx: 4,
  vy: -5
};
let blocks = [];
let rows = 6;
let cols = 7;
let blockW = 0;
let blockH = 18;
let blockMarginLeft = 10;
let blockMarginTop = 40;
let blockSpacing = 5;
let colors = [];
let particles = [];
let score = 0;
let gameOver = false;
function setup() {
  createCanvas(canvasW, canvasH);
  paddleY = height - 40;
  paddleX = (width - paddleW) / 2;
  ball.x = width / 2;
  ball.y = paddleY - 20;
  blockW = (width - blockMarginLeft * 2 - blockSpacing * (cols - 1)) / cols;
  colors = [
    color(255, 100, 100),
    color(255, 165, 79),
    color(255, 222, 89),
    color(150, 255, 150),
    color(120, 180, 255),
    color(200, 150, 255)
  ];
  createBlocks();
  textAlign(CENTER, CENTER);
}
function createBlocks() {
  blocks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let bx = blockMarginLeft + c * (blockW + blockSpacing);
      let by = blockMarginTop + r * (blockH + blockSpacing);
      let b = {
        x: bx,
        y: by,
        w: blockW,
        h: blockH,
        col: colors[r]
      };
      blocks.push(b);
    }
  }
}
function draw() {
  background(30);
  updatePaddle();
  drawPaddle();
  if (!gameOver) {
    updateBall();
    checkBlockCollisions();
  }
  drawBall();
  updateParticles();
  drawBlocks();
  drawParticles();
  drawUI();
  if (gameOver) {
    fill(255, 220, 0);
    textSize(36);
    text(
