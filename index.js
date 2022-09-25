const canvas = document.querySelector(".canvas");

canvas.width = window.innerWidth; // you can use just inner width
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const player = new Player(canvas.width / 2, canvas.height / 2, 30, "blue");

animate()
function animate() {
    player.draw(ctx);
    requestAnimationFrame(animate);
}