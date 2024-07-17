const SIDE = {NONE: 0, LEFT: 1, RIGHT: 2}

class Paddle {
    constructor(x, y, l, w, side, c){
        this.x = x;
        this.y = y;
        this.l = l;
        this.w = w;
        this.side = side;
        this.c = c;
        this.vy = 0;
        this.cpuCounter = 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.c;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.w, this.l);
        ctx.strokeRect(this.x, this.y, this.w, this.l);
    }

    move(isCPU, ball) {
        if (isCPU) {
            this.cpuCounter++;
            // Add CPU logic here if needed
            if (ball.x > (boardWidth)*3/4){
            if (this.cpuCounter >= 1) {
                this.cpuCounter = 0;
                
                // Adjust paddle velocity based on ball position
                if (paddleR.y < ball.y - 50) {
                    this.vy = paddleVelocity;
                } else if (paddleR.y > ball.y - 50) {
                    this.vy = -1 * paddleVelocity;
                } else {
                    this.vy = 0; // If paddle is aligned with ball, no vertical movement
                }
            }
            
        }}
    
        // Update paddle position
        this.y += this.vy;
        if (this.y < 0) this.y = 0;
        if (this.y + this.l > boardHeight) this.y = boardHeight - this.l;

        if(paddleR.y < ball.y && paddleR.y + paddleR.l > ball.y) {
            paddleR.vy = 0;
        }

    }
    
}


// move(isCPU, ball) {


    

//     // Stop the paddle if it reaches the ball
//     if (this.y < ball.y && this.y + this.l > ball.y) {
//         this.vy = 0;
//     }
// }
