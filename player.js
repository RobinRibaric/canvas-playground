class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {x: 0, y: 0};
        this.friction = 0.99;
    }


    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(ctx) {
        this.draw(ctx);
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        if(this.x + this.radius + this.velocity.x <= window.innerWidth && this.x - this.radius + this.velocity.x >= 0) {
            this.x += this.velocity.x;
        } else {
            this.velocity.x = 0;
        }

        if(this.y + this.radius + this.velocity.y <= window.innerHeight && this.y - this.radius + this.velocity.y >= 0) {
            this.y += this.velocity.y;
        } else {
            this.velocity.y = 0;
        }
       
    }
}