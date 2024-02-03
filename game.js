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
let score = 0;
const shootInterval = 1000; // Auto shoot every 1000 milliseconds

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function autoShoot() {
    if (bullets.length < 1) { // Allows more than one bullet on screen
        bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20,
            color: '#fffc00' // Bright yellow
        });
    }
}

setInterval(autoShoot, shootInterval);

function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bulletVelocity;

        // Check for collision with enemy
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // Remove enemy and bullet
                enemies.splice(enemyIndex, 1);
                bullets.splice(index, 1);
                score += 10; // Increase score
            }
        });
    });

    // Remove bullets that move off-screen
    bullets = bullets.filter(bullet => bullet.y + bullet.height > 0);
}

function createEnemies() {
    if (enemies.length === 0) { // Generate new wave of enemies
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
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemyVelocity;

        // Remove enemy if it moves beyond the player/bottom of the screen
        if (enemy.y > canvas.height - player.height) {
            enemies.splice(index, 1);
            // Game could end here, or you could subtract from player's lives
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleKeyboardInput();
    drawPlayer();
    drawBullets();
    drawEnemies();
    createEnemies(); // Check and create enemies if needed
    displayScore();
    requestAnimationFrame(gameLoop);
}

function handleKeyboardInput() {
    if (keys['ArrowLeft']) { player.x -= 5; }
    if (keys['ArrowRight']) { player.x += 5; }
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
}

window.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    if (e.key === ' ') e.preventDefault(); // Prevent scrolling with spacebar
});

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault(); // Prevent scrolling on mobile
    let touchX = e.touches[0].clientX;
    player.x = touchX - (player.width / 2);
}, { passive: false });

function displayScore() {
    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
}

createEnemies();
gameLoop();
