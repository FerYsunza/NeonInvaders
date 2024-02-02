//
// neonInvaders
//
// By Fer Ysunza, 02/02/24.
//

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    color: '#0f0'
};

let bullets = [];
let enemies = [];
const bulletVelocity = 5;
const enemyVelocity = 1;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = '#ff0';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bulletVelocity;
    });

    // Remove bullets that move off-screen
    bullets = bullets.filter(bullet => bullet.y + bullet.height > 0);
}

function createEnemies() {
    for(let i = 0; i < 5; i++) {
        enemies.push({
            x: i * 60 + 20,
            y: 30,
            width: 40,
            height: 40,
            color: '#f00'
        });
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemyVelocity;
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
    requestAnimationFrame(gameLoop);
}

createEnemies();
gameLoop();

canvas.addEventListener('touchmove', function(e) {
    let touchX = e.touches[0].clientX;
    player.x = touchX - (player.width / 2);
}, { passive: false });

canvas.addEventListener('touchstart', function() {
    bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20
    });
});
