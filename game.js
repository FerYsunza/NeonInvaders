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
    color: '#00ffff', // Neon cyan
};

let bullets = [];
let enemies = [];
const bulletVelocity = 5;
const enemyVelocity = 1;
let keys = {};
let score = 0;
const shootInterval = 333; // Auto shoot roughly three times per second

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

setInterval(autoShoot, shootInterval);

function autoShoot() {
    if (bullets.length < 3) { // Adjust for continuous firing without overcrowding the screen
        bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20,
            color: '#fffc00' // Bright yellow
        });
    }
}

function drawBullets() {
    bullets = bullets.filter((bullet, index) => {
        bullet.y -= bulletVelocity;
        if (bullet.y + bullet.height < 0) {
            return false; // Remove bullet if it's off the screen
        }

        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        // Check collision with enemies
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                enemies.splice(i, 1); // Remove the enemy
                score += 10; // Increase score
                return false; // Remove the bullet
            }
        }

        return true; // Keep the bullet if it didn't hit anything
    });
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
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemyVelocity;

        // Game over condition could be implemented here
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleKeyboardInput();
    drawPlayer();
    drawBullets();
    drawEnemies();
    createEnemies();
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
