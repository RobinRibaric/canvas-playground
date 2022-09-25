const canvas = document.querySelector(".canvas");

canvas.width = window.innerWidth; // you can use just inner width
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const player = new Player(canvas.width / 2, canvas.height / 2, 30, "blue");
//const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', {x: 1, y: 1,});

const projectiles = [];

animate()
function animate() {
   
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    player.draw(ctx);

    projectiles.forEach((projectile) => {
        projectile.update(ctx);
    });

}

window.addEventListener("click", (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
    const velocity = {x: Math.cos(angle), y: Math.sin(angle)};
    const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', velocity);
    projectiles.push(projectile);
});