const canvas = document.querySelector(".canvas");

canvas.width = window.innerWidth; // you can use just inner width
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const player = new Player(canvas.width / 2, canvas.height / 2, 30, "white");
//const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', {x: 1, y: 1,});

const projectiles = [];
const enemies = [];
let animationId;

animate()
spawnEnemies();

function animate() {
   
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    //ctx.clearRect(0,0,canvas.width,canvas.height);
    player.draw(ctx);

    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update(ctx);
        //removing projectiles when outside the screen
        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1);
            }, 0)
        }
    });
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update(ctx);
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if(distance - player.radius - enemy.radius < 1) {
            cancelAnimationFrame(animationId);

         /*    setTimeout(() => {
                enemies.splice(enemyIndex, 1);
                cancelAnimationFrame(animationId);
            }, 0); */
            console.log("collision detected");
        }


        projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            console.log(distance);
            
            // Where projectile touches enemy
            if(distance -enemy.radius - projectile.radius < 1) {

                if(enemy.radius - 10 > 5 ) {
                    gsap.to(enemy, {
                        radius: enemy.radius - 10,
                    });
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);

                } else {
                    setTimeout(() => {
                        enemies.splice(enemyIndex, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
               
                console.log("collision detected");
            }
        });
    });

}

window.addEventListener("click", (event) => {
    const speed = 5;
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
    const velocity = {x: Math.cos(angle) * speed, y: Math.sin(angle) * speed};
    const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity);
    projectiles.push(projectile);
});
function spawnEnemies() {
   setInterval(() => {
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