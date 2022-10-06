class Enemy {
    constructor(x, y, radius, color, velocity, player) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.radius = radius;
        this.player = player;
        this.type = "Linnear";
        this.radians = 0;
        this.center = {x, y};

        if(Math.random() < 0.5) {
            this.type = "Homing";

            if(Math.random() < .5) {
                this.type = "Spinning";

                if(Math.random() < 0.5) {
                    this.type = "Homing Spinning";
                }
            }
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
        if(this.type === "Spinning") {
            this.radians += 0.1;

            this.center.x += this.velocity.x;
            this.center.y +=  this.velocity.y;
    
            this.x = this.center.x + Math.cos(this.radians) * 30;
            this.y = this.center.y + Math.sin(this.radians) * 30;
        } else if(this.type === "Homing") {
            const angle = Math.atan2(this.player.y - this.y, this.player.x - this.x);
            this.velocity = {x: Math.cos(angle), y: Math.sin(angle)};

            this.x = this.x + this.velocity.x;
            this.y = this.y + this.velocity.y;
        }else if(this.type === "Homing Spinning") {
            this.radians += 0.1;

            const angle = Math.atan2(this.player.y - this.center.y, this.player.x - this.center.x);
            this.velocity = {x: Math.cos(angle), y: Math.sin(angle)};

            this.center.x += this.velocity.x;
            this.center.y +=  this.velocity.y;
    
            this.x = this.center.x + Math.cos(this.radians) * 30;
            this.y = this.center.y + Math.sin(this.radians) * 30;
        } else {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }
    }
}