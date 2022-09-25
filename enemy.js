class Enemy {
    constructor(x, y, radius, color, velocity, player) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.radius = radius;
        this.player = player;
        this.type = "Linear";

        if(Math.random() < 0.5) {
            this.type = "Homing";
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(ctx) {
        this.draw(ctx);
        if(this.type === "Homing") {
            const angle = Math.atan2(this.player.y - this.y, this.player.x - this.x);
            this.velocity = {x: Math.cos(angle), y: Math.sin(angle)};
        }
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}