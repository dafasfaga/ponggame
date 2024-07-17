class Obstacle {
    constructor(x, y, l, w, c) {
        this.x = x;
        this.y = y;
        this.l = l;
        this.w = w;
        this.c = c;
    }

    draw(ctx) {
        ctx.fillStyle = this.c;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.w, this.l);
        ctx.strokeRect(this.x, this.y, this.w, this.l);
    }
}
