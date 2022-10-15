const canvas = document.querySelector(".canvas");
const scoreCount = document.querySelector(".score");
const gameOverUI = document.querySelector(".game_over_ui");
const gameOverUIScore = document.querySelector(".game_over_ui_score");
const restartBtn = document.querySelector(".game_over_ui_restart_btn");
const gameStartUI = document.querySelector(".game_start_ui");
const gameStartBtn = document.querySelector(".game_start_ui_btn");

canvas.width = window.innerWidth; // you can use just inner width
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let player = new Player(canvas.width / 2, canvas.height / 2, 30, "white");
//const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', {x: 1, y: 1,});
let score = 0;
let projectiles = [];
let enemies = [];
const particles = [];
let BackgroundParticles = [];
let frames = 0;
let powerUps = [];
let animationId;
let intervalId;
let spawnPowerUpsId;

/* animate()
spawnEnemies(); */

function createScoreLabel({position, score}) {
    const scoreLabel = document.createElement('label', );
    scoreLabel.innerHTML = score;
    scoreLabel.style.color = "white";
    scoreLabel.style.position = "absolute";
    scoreLabel.style.left = `${position.x}px`;
    scoreLabel.style.top = `${position.y}px`;
    scoreLabel.style.userSelect = 'none';
    document.body.appendChild(scoreLabel);
    gsap.to(scoreLabel, {
        opacity: 0,
        y: -30,
        duration: 0.75,
        onComplete: () => {
            scoreLabel.parentNode.removeChild(scoreLabel);
        }
    })
}

function init() {
    player = new Player(canvas.width / 2, canvas.height / 2, 30, "white");
    enemies = [];
    projectiles = [];
    frames = 0;
    powerUps = [new PowerUp({
        position: {x: 100, y: 100},
    })];
    score = 0;
    animationId;
    spawnPowerUpsId;
    scoreCount.innerHTML = score;
    gameOverUIScore.innerHTML = score;
    BackgroundParticles = [];

    for(let x = 0; x < canvas.width + 15; x += 15) {
        for(let y = 0; y < canvas.height + 15; y += 15) {
            BackgroundParticles.push(new BackgroundParticle({
                position: {x, y}, 
                radius: 2,
                color: "blue"
            }))
        }
    }
}

function animate() {
    frames++;
   
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    BackgroundParticles.forEach((particle) => {
        const dist = Math.hypot(player.x - particle.position.x, player.y - particle.position.y);
        if(dist < 100) {
            particle.alpha = 0;

            if(dist > 70) {
                particle.alpha = 0.5;
            } 
        } else  if(dist > 100 && particle.alpha < 0.1){
            particle.alpha += 0.01;
        } else if(dist > 100 && particle.alpha > 0.1) {
            particle.alpha -= 0.01;
        }
        particle.draw(ctx);
    });
    //ctx.clearRect(0,0,canvas.width,canvas.height);
    player.update(ctx);
    for(let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];

        if(powerUp.position.x > canvas.width) {
            powerUps.splice(i, 1);
        } else {
            powerUp.update(ctx);
        }


        const distance = Math.hypot(player.x - powerUp.position.x, player.y - powerUp.position.y);

        if(distance < powerUp.image.height / 2 + player.radius) {
            powerUps.splice(i, 1);
            player.powerUp = "MachineGun";
            player.color = "yellow";
            setTimeout(() => {
                player.powerUp = null;
                player.color = "white";
            }, 10000);
            console.log("hit")
        }
    }

    // machinge gun animation / implementation
    if(player.powerUp === "MachineGun") {
        const speed = 5;
        const angle = Math.atan2(mouse.position.y - player.y, mouse.position.x - player.x);
        const velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};

        //Create a new projectile every 2 frames
        if(frames % 2 === 0) {
            projectiles.push(new Projectile(player.x, player.y, 5, "yellow", velocity));
        }
    }

    for(let particleIndex = particles.length - 1; particleIndex >= 0; particleIndex--) {
        const particle = particles[particleIndex];
        if(particle.alpha <= 0) {
            particles.splice(particleIndex, 1);
        } else {
            particle.update(ctx);
        }
    }

    for(let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
        const projectile = projectiles[projectileIndex];

        projectile.update(ctx);
        //removing projectiles when outside the screen
        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            projectiles.splice(projectileIndex, 1);
        }  
    }
   
    for(let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
        const enemy = enemies[enemyIndex];
        enemy.update(ctx);
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        //Ending the game on player collision
        if(distance - player.radius - enemy.radius < 1) {
            cancelAnimationFrame(animationId);
            clearInterval(intervalId);
            gameOverUIScore.innerHTML = score;
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



        for(let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
            const projectile = projectiles[projectileIndex];

            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            
            // Where projectile touches enemy
            if(distance -enemy.radius - projectile.radius < 1) {
                
                // Create explosions
                for(let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random() - 0.5 *(Math.random() * 6)), y: (Math.random() - 0.5) * (Math.random() * 6)}))
                }

                if(enemy.radius - 10 > 5 ) {
                    score += 100;
                    gsap.to(enemy, {
                        radius: enemy.radius - 10,
                    });
                    createScoreLabel({position: {
                        x: projectile.x,
                        y: projectile.y
                    }, score: 100});
                    projectiles.splice(projectileIndex, 1);
                } else {
                    //Remove enemy and projectile
                    createScoreLabel({position: {
                        x: projectile.x,
                        y: projectile.y
                    }, score: 150});
                    BackgroundParticles.forEach((backgroundParticle) => {
                        /* gsap.set(backgroundParticle, {
                            color: "white",
                            alpha: 1,
                        }) */
                        gsap.to(backgroundParticle, {
                            color: enemy.color,
                            alpha: 0.1,
                        })
                        backgroundParticle.color = enemy.color;
                    })
                    enemies.splice(enemyIndex, 1); 
                    projectiles.splice(projectileIndex, 1);
                    score += 150;
                     
                }
                scoreCount.innerHTML = `${score}`;
                console.log("collision detected");
            }
        }
    }
}

const mouse = {
    position: {
        x: 0,
        y: 0,
    }
}

addEventListener("mousemove", (event) => {
    mouse.position.x = event.clientX;
    mouse.position.y = event.clientY;
})

window.addEventListener("click", (event) => {
    const speed = 5;
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    const velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
    const projectile = new Projectile(player.x, player.y, 5, 'white', velocity);
    projectiles.push(projectile);
});

window.addEventListener("keydown", (event) => {
    console.log(event.key);
    const speed = 1;
    switch(event.key) {
        case "ArrowRight":
            console.log()
            player.velocity.x += speed;
            break;
        case "ArrowLeft":
            player.velocity.x -= speed;
            break;
        case "ArrowDown":
            player.velocity.y += speed;
            break;
        case "ArrowUp":
            player.velocity.y -= speed;
            break;
        case "d":
            console.log()
            player.velocity.x += speed;
            break;
        case "a":
            player.velocity.x -= speed;
            break;
        case "s":
            player.velocity.y += speed;
            break;
        case "w":
            player.velocity.y -= speed;
            break;
    }
});

//Restart Game
gameStartBtn.addEventListener("click",() => {
    init();
    animate();
    spawnEnemies();
    spawnPowerUps();
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
        init();
        animate();
        spawnEnemies();
    }
  });
});



function spawnEnemies() {
    intervalId = setInterval(() => {
        const radius = Math.random() * (30 - 8) + 8;
        let x = 0;
        let y = 0;
        
        console.log("go");
        if(Math.random() < 0.5) {
             x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;//Math.random() * canvas.width;
             y = Math.random() * canvas.height//Math.random() < 0.5 ? 0 - radius :  canvas.height + radius;
        } else {
            x = Math.random() * canvas.width;//Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius :  canvas.height + radius;
        }
        
        
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(player.y - y, player.x - x);
        const velocity = {x: Math.cos(angle), y: Math.sin(angle)};
        enemies.push(new Enemy(x, y, radius, color, velocity, player))
    }, 1000);
}

function spawnPowerUps() {
    spawnPowerUpsId = setInterval(() => {
        powerUps.push(new PowerUp({
            position: {
                x: -30,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: Math.random() * 1,
                y: 0,
            }
        }));
    }, 10000);
}