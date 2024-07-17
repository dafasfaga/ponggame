const gameboard = document.getElementById("gameboard");
const cpucheck = document.getElementById("cpucheck");
const ctx = gameboard.getContext("2d");
const STATE = {STARTUP: 0, PLAYING: 1, GAMEOVER: 2};
let state = STATE.STARTUP;
let boardWidth = gameboard.width;
let boardHeight = gameboard.height;
let paddleWidth = 25;
let paddleLength = 100;
let ballRadius = 12.5;
let paddleVelocity = 5;
let paddleForce = 1.1;

let ball;
let paddleL;
let paddleR;
let obstacle;
let scoreL = 0;
let scoreR = 0;
let intervalID;

function clearBoard() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, boardWidth, boardHeight);
}

function draw() {
    clearBoard();
    ball.draw(ctx);
    paddleL.draw(ctx);
    paddleR.draw(ctx);
    if (obstacle) {
        obstacle.draw(ctx); // Draw the obstacle if it exists
    }
}

function resetGame() {
    clearInterval(intervalID);
    scoreL = 0;
    scoreR = 0;
    updateScore();
    state = STATE.STARTUP;
    resetBall();
    paddleL = new Paddle(0, (boardHeight - paddleLength) / 2, paddleLength, paddleWidth, SIDE.LEFT, "red");
    paddleR = new Paddle(boardWidth - paddleWidth, (boardHeight - paddleLength) / 2, paddleLength, paddleWidth, SIDE.RIGHT, "blue");
    spawnObstacle();
    nextTick();
}

function resetBall() {
    ball = new Ball(boardWidth / 2, boardHeight / 2, 1, -1, ballRadius, "yellow");
}

function spawnObstacle() {
    let x = Math.random() * (boardWidth - 50);
    let y = Math.random() * (boardHeight - 50);
    let l = 50; // Obstacle length
    let w = 50; // Obstacle width
    let c = "purple"; // Obstacle color
    obstacle = new Obstacle(x, y, l, w, c);
}

function nextTick() {
    switch (state) {
        case STATE.STARTUP:
            state = STATE.PLAYING;
            break;
        case STATE.PLAYING:
            state = play();
            break;
        case STATE.GAMEOVER:
            clearInterval(intervalID);
            break;
        default:
            state = STATE.STARTUP;
            break;
    }
    draw();
    intervalID = setTimeout(nextTick, 10);
}

function play() {
    paddleL.move(false, ball);
    paddleR.move(cpucheck.checked, ball);
    let scoreSide = ball.bounce([paddleL, paddleR, obstacle]); // Include obstacle in the bounce method
    if (scoreSide != SIDE.NONE) {
        if (scoreSide == SIDE.LEFT) scoreL++;
        if (scoreSide == SIDE.RIGHT) scoreR++;
        updateScore();
        resetBall();
        if (scoreL > 10 || scoreR > 10) return STATE.GAMEOVER;
    }
    ball.move();
    return STATE.PLAYING;
}

function updateScore() {
    const scoreboard = document.getElementById("scoreboard");
    scoreboard.innerHTML = `${scoreL} : ${scoreR}`;
}

// Initialize the game
resetGame();
