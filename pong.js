const gameboard = document.getElementById("gameboard");
const cpucheck = document.getElementById("cpucheck");
const cpucheckL = document.getElementById("cpucheckL");

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
let obstacles = []; // Array to hold all obstacles
let powerUps = []; // Array to hold all powerups
let scoreL = 0;
let scoreR = 0;
let intervalID; // Declare intervalID here
let ballSpeed = 1; // Default ball speed

const paddleSoundLeft = document.getElementById("paddleSoundLeft");
const paddleSoundRight = document.getElementById("paddleSoundRight");

let userInteracted = false;

function handleUserInteraction() {
    userInteracted = true;
    document.removeEventListener("click", handleUserInteraction);
    document.removeEventListener("keydown", handleUserInteraction);
}

document.addEventListener("click", handleUserInteraction);
document.addEventListener("keydown", handleUserInteraction);

function clearBoard() {
    ctx.fillStyle = "#1E90FF"; // Vibrant blue background color
    ctx.fillRect(0, 0, boardWidth, boardHeight);
}

function draw() {
    clearBoard();
    ball.draw(ctx);
    paddleL.draw(ctx);
    paddleR.draw(ctx);
    // Draw all obstacles
    for (let obstacle of obstacles) {
        obstacle.draw(ctx);
    }
    // Draw all powerups
    for (let powerUp of powerUps) {
        powerUp.draw(ctx);
    }
}

function resetGame() {
    clearInterval(intervalID);
    scoreL = 0;
    scoreR = 0;
    updateScore();
    state = STATE.STARTUP;
    resetBall();
    paddleL = new Paddle(0, (boardHeight - paddleLength) / 2, paddleLength, paddleWidth, SIDE.LEFT, "#FF6347"); // Red color
    paddleR = new Paddle(boardWidth - paddleWidth, (boardHeight - paddleLength) / 2, paddleLength, paddleWidth, SIDE.RIGHT, "#FFC0CB"); // Pink color
    obstacles = []; // Reset obstacles array
    powerUps = []; // Reset powerups array
    spawnObstacles();
    spawnPowerups();
    nextTick();
}

function resetBall() {
    ball = new Ball(boardWidth / 2, boardHeight / 2, 1, -1, ballRadius);
    ball.lastHitBy = null; // Reset the lastHitBy property
    ball.superSmash = null; // Reset the superSmash property
}

function spawnObstacles() {
    let l = 50; // Obstacle length
    let w = 50; // Obstacle width
    let imgSrc = 'https://png.pngtree.com/png-clipart/20230819/original/pngtree-red-flag-sand-castle-icon-picture-image_8047443.png'; // URL to your obstacle image

    // Create the first obstacle on the left side
    let x1 = (Math.random() * (boardWidth / 2 - w)) + 50;
    let y1 = Math.random() * (boardHeight - l);
    obstacles.push(new Obstacle(x1, y1, l, w, imgSrc));

    // Create the second obstacle on the right side
    let x2 = (boardWidth - (Math.random() * (boardWidth / 2 - w) + w)) - 50;
    let y2 = Math.random() * (boardHeight - l);
    obstacles.push(new Obstacle(x2, y2, l, w, imgSrc));
}

function spawnPowerups() {
    let types = ["Extend Paddle Length", "Super Smash", "Shrink Opponent Paddle"];
    for (let type of types) {
        let x = Math.random() * (boardWidth - 100);
        let y = Math.random() * (boardHeight - 30);
        powerUps.push(new Powerup(x, y, type));
    }
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
            clearBoard();
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "30px 'Orbitron', sans-serif";
            if (scoreL > 10) {
                ctx.fillText("Left Wins", boardWidth / 2 - 75, boardHeight / 2);
            } else if (scoreR > 10) {
                ctx.fillText("Right Wins", boardWidth / 2 - 75, boardHeight / 2);
            }
            return;
        default:
            state = STATE.STARTUP;
            break;
    }
    draw();
    intervalID = setTimeout(nextTick, 10);
}

function play() {
    paddleL.move(cpucheckL.checked, ball);
    paddleR.move(cpucheck.checked, ball);
    let scoreSide = ball.bounce([paddleL, paddleR, ...obstacles, ...powerUps]); // Include all obstacles and powerups in the bounce method
    if (scoreSide != SIDE.NONE) {
        if (scoreSide == SIDE.LEFT) { 
            scoreL++;
            if (userInteracted) {
                paddleSoundLeft.currentTime = 0;
                paddleSoundLeft.play(); 
            }
        }
        if (scoreSide == SIDE.RIGHT) {
            scoreR++;
            if (userInteracted) {
                paddleSoundRight.currentTime = 0;  
                paddleSoundRight.play(); 
            }
        }
        updateScore();
        resetBall();
        if (scoreL > 10 || scoreR > 10) return STATE.GAMEOVER;
    }

    // Check for powerup collision and apply effect
    for (let powerUp of powerUps) {
        if (powerUp.checkCollision(ball)) {
            powerUp.applyEffect(paddleL, paddleR, ball);
        }
    }

    ball.move(ballSpeed);
    return STATE.PLAYING;
}

function updateScore() {
    const scoreboard = document.getElementById("scoreboard");
    scoreboard.innerHTML = `${scoreL} : ${scoreR}`;
}

// Event listener for the slider
document.addEventListener("DOMContentLoaded", function() {
    const speedSlider = document.getElementById("speedSlider");
    speedSlider.classList.add("slider");
    
    // Initial ball speed value
    ballSpeed = parseFloat(speedSlider.value);
    
    speedSlider.addEventListener("input", function() {
        // Update ball speed based on slider value
        ballSpeed = parseFloat(speedSlider.value);
    });
});

// Initialize the game
resetGame();
