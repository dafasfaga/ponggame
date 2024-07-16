window.addEventListener("keydown", keyDown);
function keyDown(event) {
    const key = event.code;

    switch(key) {
        case "KeyW":
            paddleL.vy = -paddleVelocity;
            break;
        case "KeyS":
            paddleL.vy = paddleVelocity;
            break;
        case "ArrowUp":
            paddleR.vy = -paddleVelocity;
            break;
        case "ArrowDown":
            paddleR.vy = paddleVelocity;
            break;
        case "End":
            resetGame();
            break;
    }
}

window.addEventListener("keyup", keyUp);
function keyUp(event) {
    const key = event.code;

    switch(key) {
        case "KeyW":
        case "KeyS":
            paddleL.vy = 0;
            break;
        case "ArrowUp":
        case "ArrowDown":
            paddleR.vy = 0;
            break;
    }
}
