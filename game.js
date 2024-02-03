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
    color: '#00ffff' // Neon cyan
};

let bullets = [];
let enemies = [];
const bulletVelocity = 5;
const enemyVelocity = 1;
let keys = {};

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = '#fffc00'; // Bright yellow
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bulletVelocity;
    });
    bullets = bullets.filter(bullet => bullet.y + bullet.height > 0);
}

function createEnemies() {
    for(let i = 0; i < 5; i++) {
        enemies.push({
            x: i * 60 + 20,
            y: 30,
            width: 40,
            height: 40,
            color: '#ff00ff' // Neon pink
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
    handleKeyboardInput();
    drawPlayer();
    drawBullets();
    drawEnemies();
    requestAnimationFrame(gameLoop);
}

function handleKeyboardInput() {
    if (keys['ArrowLeft']) { player.x -= 5; }
    if (keys['ArrowRight']) { player.x += 5; }
    if (keys['Space']) { shootBullet(); }
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
}

window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

function shootBullet() {
    if (!bullets.some(b => b.y <= canvas.height && b.y >= 0)) {
        bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20,
            color: '#fffc00' // Bright yellow
        });
    }
}

canvas.addEventListener('touchmove', function(e) {
    let touchX = e.touches[0].clientX;
    player.x = touchX - (player.width / 2);
}, { passive: false });

canvas.addEventListener('touchstart', function() {
    shootBullet();
});

createEnemies();
gameLoop();
