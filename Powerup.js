class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 100;
        this.height = 30;
        this.collected = false;
        this.collectedBy = null;
    }

    draw(ctx) {
        if (!this.collected) {
            ctx.fillStyle = "#FFD700"; // Gold color for powerup
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000000"; // Black text color
            ctx.font = "12px 'Orbitron', sans-serif";
            ctx.fillText(this.type, this.x + 5, this.y + 20);
        }
    }

    checkCollision(ball) {
        if (!this.collected &&
            ball.x + ball.r > this.x &&
            ball.x - ball.r < this.x + this.width &&
            ball.y + ball.r > this.y &&
            ball.y - this.y < this.height) {
            this.collected = true;
            this.collectedBy = ball.lastHitBy;
            return true;
        }
        return false;
    }

    applyEffect(paddleL, paddleR, ball) {
        if (this.type === "Extend Paddle Length") {
            if (this.collectedBy === "LEFT") {
                paddleL.l *= 1.5;
            } else {
                paddleR.l *= 1.5;
            }
        } else if (this.type === "Super Smash") {
            ball.superSmash = this.collectedBy;
        } else if (this.type === "Shrink Opponent Paddle") {
            if (this.collectedBy === "LEFT") {
                paddleR.l *= 0.5;
            } else {
                paddleL.l *= 0.5;
            }
        }
    }
}
