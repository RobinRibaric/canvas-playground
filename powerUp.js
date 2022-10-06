class PowerUp {
    constructor({position = {x: 0, y: 0}, velocity = {x: 0, y: 0}}) {
        this.position = position;
        this.velocity = velocity;
        this.alpha = 1;

        this.image = new Image();
        this.image.src = "./images/lightningBolt.png";
        gsap.to(this, {
            alpha: 0,
            duration: 0.3,
            repeat: -1,
            yoyo: true,
        });

        this.radians = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.position.x + this.image.width / 2, this.position.y + this.image.height / 2);
        ctx.rotate(this.radians);
        ctx.translate(-this.position.x - this.image.width / 2, -this.position.y - this.image.height / 2);

        ctx.drawImage(this.image, 100, 100);
        ctx.restore();
    }

    update(ctx) {
        this.draw(ctx);
        this.radians += 0.01;
        this.position.x += this.velocity.x;
    }
}
