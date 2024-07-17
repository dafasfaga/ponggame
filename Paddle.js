const SIDE = {NONE: 0, LEFT: 1, RIGHT: 2};

class Paddle {
    constructor(x, y, l, w, side, c) {
        this.x = x;
        this.y = y;
        this.l = l;
        this.w = w;
        this.side = side;
        this.c = c || "#FF6347"; // Default to vibrant red color
        this.vy = 0;
        this.cpuCounter = 0;
        this.jumpDistance = 20; // Distance the paddle will jump
    }

    draw(ctx) {
        ctx.fillStyle = this.c;
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.w, this.l);
        ctx.strokeRect(this.x, this.y, this.w, this.l);
    }

    move(isCPU, ball) {
        let hardR = 3 / 4;
        let hardL = 1 / 4;
        const isHard = document.getElementById("hardCheck").checked;

        if (isHard) {
            hardR = 0;
            hardL = 1;
        }

        if (isCPU) {
            this.cpuCounter++;
            if (this.cpuCounter >= 1) {
                this.cpuCounter = 0;

                // AI logic to "jump" towards the ball
                const paddleCenter = this.y + this.l / 2;
                const ballY = ball.y;

                if (this.side == SIDE.RIGHT) {
                    if (ball.x > boardWidth * hardR) {
                        if (Math.abs(ballY - paddleCenter) > this.jumpDistance) {
                            if (ballY > paddleCenter) {
                                this.vy = paddleVelocity;
                            } else {
                                this.vy = -paddleVelocity;
                            }
                        } else {
                            this.vy = 0; // If the paddle is close enough to the ball's position, stop moving
                        }
                    }
                } else if (this.side == SIDE.LEFT) {
                    if (ball.x < boardWidth * hardL) {
                        if (Math.abs(ballY - paddleCenter) > this.jumpDistance) {
                            if (ballY > paddleCenter) {
                                this.vy = paddleVelocity;
                            } else {
                                this.vy = -paddleVelocity;
                            }
                        } else {
                            this.vy = 0; // If the paddle is close enough to the ball's position, stop moving
                        }
                    }
                }
            }
        }

        // Update paddle position
        this.y += this.vy;
        if (this.y < 0) this.y = 0;
        if (this.y + this.l > boardHeight) this.y = boardHeight - this.l;
    }
}
