class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 60; // Adjust size to fit the image
        this.height = 60; // Adjust size to fit the image
        this.collected = false;
        this.collectedBy = null;
        this.image = new Image();

        // Set the image source based on the type of power-up
        if (type === "Extend Paddle Length") {
            this.image.src = 'https://purepng.com/public/uploads/large/purepng.com-sun-glassesglasseseyeglassesspectaclesplastic-lensesmountedsun-glasses-1421526498972uufgv.png';
        } else if (type === "Super Smash") {
            this.image.src = 'https://png.pngtree.com/png-vector/20220901/ourmid/pngtree-pink-ice-cream-cone-png-image_6134364.png';
        } else if (type === "Shrink Opponent Paddle") {
            this.image.src = 'https://www.pngall.com/wp-content/uploads/10/Flip-Flops-Vector-PNG-HD-Image.png';
        }
    }

    draw(ctx) {
        if (!this.collected) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
