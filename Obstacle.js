class Obstacle {
    constructor(x, y, l, w, imgSrc) {
        this.x = x;
        this.y = y;
        this.l = l;
        this.w = w;
        this.image = new Image();
        this.image.src = imgSrc; // Path to your obstacle image
        this.imageLoaded = false;

        // Set the imageLoaded flag to true when the image is fully loaded
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.w, this.l);
        } else {
            // Draw a placeholder or fallback shape if the image is not yet loaded
            ctx.fillStyle = "#FFD700"; // Vibrant yellow color as a placeholder
            ctx.fillRect(this.x, this.y, this.w, this.l);
            ctx.strokeStyle = "#FF4500";
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.w, this.l);
        }
    }
}
