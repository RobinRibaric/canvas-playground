class BackgroundParticle {
    constructor({position, radius = 3, color}) {
        this.position = position;
        this.color = color;
        this.radius = radius;
        this.alpha = 0.1;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}