const scoreCount = document.querySelector(".score");
const gameOverUI = document.querySelector(".game_over_ui");
const gameOverUIScore = document.querySelector(".game_over_ui_score");
const restartBtn = document.querySelector(".game_over_ui_restart_btn");
const gameStartUI = document.querySelector(".game_start_ui");
const gameStartBtn = document.querySelector(".game_start_ui_btn");

class Game {
    constructor(ctx, canvas){
        this.canvas = canvas;
        this.ctx = ctx;
        this.player = new Player(canvas.width / 2, canvas.height / 2, 30, "white");
        this.score = 0;
        this.projectiles = [];
        this.enemies = [];
        this.particles = [];
        this.frames = 0;
        this.powerUps = [];
        this.animationId;
        this.intervalId;
        this.spawnPowerUpsId;
        this.mouse = {
            position: {
                x: 0,
                y: 0,
            }
        }

         //Restart Game
        
    }

    attachListeners() {
        gameStartBtn.addEventListener("click",() => {
            this.init();
            this.animate();
            this.spawnEnemies();
            this.spawnPowerUps();
            gsap.to(".game_start_ui", {
                opacity: 0,
                scale: 0.8,
                duration: 0.25,
                ease: "expo.in",
                onComplete: () => {
                    gameStartUI.style.display = "none";
                }
            });
        });
        
        restartBtn.addEventListener("click", (event) => {
        gsap.to(".game_over_ui", {
            opacity: 0,
            scale: 0.8,
            duration: 0.25,
            ease: "expo.in",
            onComplete: () => {
                gameOverUI.style.display = "none";
                this.init();
                this.animate();
                this.spawnEnemies();
            }
        });
        });

        addEventListener("mousemove", (event) => {
            this.mouse.position.x = event.clientX;
            this.mouse.position.y = event.clientY;
        })
        
        window.addEventListener("click", (event) => {
            const speed = 5;
            const angle = Math.atan2(event.clientY - this.player.y, event.clientX - this.player.x);
            const velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
            const projectile = new Projectile(this.player.x, this.player.y, 5, 'white', velocity);
            this.projectiles.push(projectile);
        });
        
        window.addEventListener("keydown", (event) => {
            console.log(event.key);
            const speed = 1;
            switch(event.key) {
                case "ArrowRight":
                    console.log()
                    this.player.velocity.x += speed;
                    break;
                case "ArrowLeft":
                    this.player.velocity.x -= speed;
                    break;
                case "ArrowDown":
                    this.player.velocity.y += speed;
                    break;
                case "ArrowUp":
                    this.player.velocity.y -= speed;
                    break;
                case "d":
                    console.log()
                    this.player.velocity.x += speed;
                    break;
                case "a":
                    this.player.velocity.x -= speed;
                    break;
                case "s":
                    this.player.velocity.y += speed;
                    break;
                case "w":
                    this.player.velocity.y -= speed;
                    break;
            }
        });
    }

    init() {
        this.player = new Player(canvas.width / 2, canvas.height / 2, 30, "white");
        this.enemies = [];
        this.projectiles = [];
        this.frames = 0;
        this.powerUps = [];
        this.score = 0;
        this.animationId;
        this.spawnPowerUpsId;
        scoreCount.innerHTML = this.score;
        gameOverUIScore.innerHTML = this.score;
    }
    
    animate() { 
        console.log(this.animate)      
        this.animationId = requestAnimationFrame(this.animate);
        this.frames += 1;
        this.ctx.fillStyle = "rgba(0,0,0,0.1)";
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
        //ctx.clearRect(0,0,canvas.width,canvas.height);
        this.player.update(this.ctx);
        for(let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            const distance = Math.hypot(this.player.x - powerUp.position.x, this.player.y - powerUp.position.y);
            if(distance < powerUp.image.height / 2 + this.player.radius) {
                this.powerUps.splice(i, 1);
                this.player.powerUp = "MachineGun";
                setTimeout(() => {
                    this.player.powerUp = null;
                }, 10000);
                console.log("hit")
            }
            powerUp.update(this.ctx);
        }
    
        // machinge gun animation / implementation
        if(this.player.powerUp) {
            const speed = 5;
            const angle = Math.atan2(this.mouse.position.y - this.player.y, this.mouse.position.x - this.player.x);
            const velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
    
            //Create a new projectile every 2 frames
            if(this.frames % 2 === 0) {
                this.projectiles.push(new Projectile(this.player.x, this.player.y, 5, "yellow", velocity));
            }
        }
    
        for(let particleIndex = this.particles.length - 1; particleIndex >= 0; particleIndex--) {
            const particle = this.particles[particleIndex];
            if(particle.alpha <= 0) {
                this.particles.splice(particleIndex, 1);
            } else {
                particle.update(this.ctx);
            }
        }
    
        for(let projectileIndex = this.projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
            const projectile = this.projectiles[projectileIndex];
    
            projectile.update(this.ctx);
            //removing projectiles when outside the screen
            if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > this.canvas.width ||
                projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > this.canvas.height) {
                this.projectiles.splice(projectileIndex, 1);
            }  
        }
       
        for(let enemyIndex = this.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
            const enemy = this.enemies[enemyIndex];
            enemy.update(this.ctx);
            const distance = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
    
            //Ending the game on player collision
            if(distance - this.player.radius - enemy.radius < 1) {
                cancelAnimationFrame(this.animationId);
                clearInterval(this.intervalId);
                gameOverUIScore.innerHTML = this.score;
                gameOverUI.style.display = "block";
                gsap.fromTo(".game_over_ui", {
                    opacity: 0,
                    scale: 0.8,
                  }, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.25,
                    ease: "expo",
                });
            }
    
    
    
            for(let projectileIndex = this.projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
                const projectile = this.projectiles[projectileIndex];
    
                const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
                
                // Where projectile touches enemy
                if(distance - enemy.radius - projectile.radius < 1) {
                    
                    // Create explosions
                    for(let i = 0; i < enemy.radius * 2; i++) {
                        this.particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random() - 0.5 *(Math.random() * 6)), y: (Math.random() - 0.5) * (Math.random() * 6)}))
                    }
    
                    if(enemy.radius - 10 > 5 ) {
                        this.score += 100;
                        gsap.to(enemy, {
                            radius: enemy.radius - 10,
                        });
                        this.projectiles.splice(projectileIndex, 1);
                    } else {
                        //Remove enemy and projectile
                        this.enemies.splice(enemyIndex, 1); 
                        this.projectiles.splice(projectileIndex, 1);
                        this.score += 150;
                         
                    }
                    scoreCount.innerHTML = `${this.score}`;
                    console.log("collision detected");
                }
            }
        }
    }
    
    spawnEnemies() {
        this.intervalId = setInterval(() => {
            const radius = Math.random() * (30 - 8) + 8;
            let x = 0;
            let y = 0;
            
            if(Math.random() < 0.5) {
                 x = Math.random() < 0.5 ? 0 - radius : this.canvas.width + radius;//Math.random() * canvas.width;
                 y = Math.random() * this.canvas.height//Math.random() < 0.5 ? 0 - radius :  canvas.height + radius;
            } else {
                x = Math.random() * this.canvas.width;//Math.random() * canvas.width;
                y = Math.random() < 0.5 ? 0 - radius :  this.canvas.height + radius;
            }
            
            
            const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
            const angle = Math.atan2(this.player.y - y, this.player.x - x);
            const velocity = {x: Math.cos(angle), y: Math.sin(angle)};
            this.enemies.push(new Enemy(x, y, radius, color, velocity, this.player))
        }, 1000);
    }
    
    spawnPowerUps() {
        this.spawnPowerUpsId = setInterval(() => {
            this.powerUps.push(new PowerUp({
                position: {
                    x: 100,
                    y: 100
                },
                velocity: {
                    x: 1,
                    y: 0,
                }
            }));
        }, 10000);
    }
}