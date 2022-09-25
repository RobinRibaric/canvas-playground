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
let animationId;
let intervalId;

/* animate()
spawnEnemies(); */

function animate() {
   
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    //ctx.clearRect(0,0,canvas.width,canvas.height);
    player.draw(ctx);

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
                    projectiles.splice(projectileIndex, 1);
                } else {
                    //Remove enemy and projectile
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

window.addEventListener("click", (event) => {
    const speed = 5;
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
    const velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
    const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity);
    projectiles.push(projectile);
});

gameStartBtn.addEventListener("click",() => {
    gameStartUI.style.display = "none";
    init();
    animate();
    spawnEnemies();
});

restartBtn.addEventListener("click", (event) => {
  init();
  animate();
  spawnEnemies();
  gameOverUI.style.display = "none";
});

function init() {
    player = new Player(canvas.width / 2, canvas.height / 2, 30, "white");
    enemies = [];
    projectiles = [];
    score = 0;
    animationId
    scoreCount.innerHTML = score;
    gameOverUIScore.innerHTML = score;
}

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
        const angle = Math.atan2( canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = {x: Math.cos(angle), y: Math.sin(angle)};
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000);
}