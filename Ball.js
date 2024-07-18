class Ball {
    constructor(x, y, vx, vy, r) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
        this.inPlay = false;
        this.image = new Image();
        this.image.src = 'https://static.vecteezy.com/system/resources/previews/029/327/333/original/beach-ball-sport-balls-2d-color-illustrations-png.png'; // URL to your beach ball image
        this.imageLoaded = false;
        this.lastHitBy = null; // Track the last paddle that hit the ball
        this.superSmash = null; // Track which side has the super smash effect
        this.originalSpeed = { vx: vx, vy: vy }; // Store the original speed
        this.tripleSpeed = false; // Flag to track if the speed is tripled

        // Set the imageLoaded flag to true when the image is fully loaded
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
        } else {
            // Draw a placeholder or fallback shape if the image is not yet loaded
            ctx.fillStyle = "#FF6347"; // Vibrant red color as a placeholder
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    move(speedMultiplier) {
        this.x += this.vx * speedMultiplier;
        this.y += this.vy * speedMultiplier;
    }

    bounce(things) {
        let scoreSide = this.bounceWalls();
        if (scoreSide !== SIDE.NONE) {
            return scoreSide;
        }
        for (let thing of things) {
            if (thing instanceof Paddle) {
                if (thing.side == SIDE.LEFT) {
                    let side = this.bounceLeftPaddle(thing);
                    if (side != SIDE.NONE) return side;
                }
                if (thing.side == SIDE.RIGHT) {
                    let side = this.bounceRightPaddle(thing);
                    if (side != SIDE.NONE) return side;
                }
            }
            if (thing instanceof Obstacle) {
                this.bounceObstacle(thing);
            }
        }
        return SIDE.NONE;
    }

    bounceWalls() {
        if (this.y - this.r < 0) {
            this.vy = Math.abs(this.vy);
        }
        if (this.y + this.r > boardHeight) {
            this.vy = -Math.abs(this.vy);
        }
        if (this.x - this.r < 0) {
            return SIDE.LEFT; // Right side scores when the ball hits the left side
        }
        if (this.x + this.r > boardWidth) {
            return SIDE.RIGHT; // Left side scores when the ball hits the right side
        }
        return SIDE.NONE;
    }

    bounceLeftPaddle(paddle) {
        if (this.x - this.r > paddle.w) return SIDE.NONE;
        if (this.x - this.r < 0) return SIDE.RIGHT;
        if (this.y < paddle.y) return SIDE.NONE;
        if (this.y > paddle.y + paddle.l) return SIDE.NONE;
        if (this.vx < 0) {
            if (this.superSmash === "LEFT") {
                this.vx *= 3; // Triple the speed if super smash was collected by the left paddle
                this.tripleSpeed = true; // Set the triple speed flag
                this.superSmash = null; // Reset the super smash effect
            } else if (this.tripleSpeed && this.lastHitBy === "RIGHT") {
                this.vx = this.originalSpeed.vx; // Reset speed if the opponent hits the ball
                this.vy = this.originalSpeed.vy;
                this.tripleSpeed = false; // Reset the triple speed flag
            }
            this.vx = paddleForce * Math.abs(this.vx);
            let paddlePos = (this.y - paddle.y - paddle.l / 2) / paddle.l * 2;
            this.vy += paddlePos * 1.5;
            this.lastHitBy = "LEFT"; // Track the last paddle that hit the ball
        }
        return SIDE.NONE;
    }

    bounceRightPaddle(paddle) {
        if (this.x + this.r < paddle.x) return SIDE.NONE;
        if (this.x + this.r > paddle.x + paddle.w) return SIDE.LEFT;
        if (this.y < paddle.y) return SIDE.NONE;
        if (this.y > paddle.y + paddle.l) return SIDE.NONE;
        if (this.vx > 0) {
            if (this.superSmash === "RIGHT") {
                this.vx *= 3; // Triple the speed if super smash was collected by the right paddle
                this.tripleSpeed = true; // Set the triple speed flag
                this.superSmash = null; // Reset the super smash effect
            } else if (this.tripleSpeed && this.lastHitBy === "LEFT") {
                this.vx = this.originalSpeed.vx; // Reset speed if the opponent hits the ball
                this.vy = this.originalSpeed.vy;
                this.tripleSpeed = false; // Reset the triple speed flag
            }
            this.vx = -paddleForce * Math.abs(this.vx);
            let paddlePos = (this.y - paddle.y - paddle.l / 2) / paddle.l * 2;
            this.vy += paddlePos * 1.5;
            this.lastHitBy = "RIGHT"; // Track the last paddle that hit the ball
        }
        return SIDE.NONE;
    }

    bounceObstacle(obstacle) {
        if (
            this.x + this.r > obstacle.x &&
            this.x - this.r < obstacle.x + obstacle.w &&
            this.y + this.r > obstacle.y &&
            this.y - this.r < obstacle.y + obstacle.l
        ) {
            // Determine if the ball hits the obstacle from the sides or the top/bottom
            const overlapX = Math.min(this.x + this.r - obstacle.x, obstacle.x + obstacle.w - (this.x - this.r));
            const overlapY = Math.min(this.y + this.r - obstacle.y, obstacle.y + obstacle.l - (this.y - this.r));

            // Reverse the appropriate velocity based on the smaller overlap
            if (overlapX < overlapY) {
                this.vx = -this.vx;
            } else {
                this.vy = -this.vy;
            }
        }
    }
}
