//
// neonInvaders
//
// By Fer Ysunza, 02/02/24.
//

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const startButtonContainer = document.getElementById('startButtonContainer');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gameActive = false;
    let audioContext;
    let player = { x: canvas.width / 2 - 15, y: canvas.height - 60, width: 30, height: 30, color: '#00ffff' };
    let bullets = [];
    let enemies = [];
    const bulletVelocity = 5;
    const enemyVelocity = 1;
    let keys = {};
    let score = 0;
    const enemySpawnInterval = 20000; // New enemy wave every 20 seconds

    function userInteracted() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        audioContext.resume();
    }

    function createOscillator(freq, type, duration, decay) {
        if (!audioContext) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + decay);
    }

    function playShootSound() { createOscillator(400, 'square', 0.1, 0.1); }
    function playEnemyHitSound() { createOscillator(150, 'triangle', 0.2, 0.2); }
    function playEnemyReachPlayerSound() { createOscillator(100, 'sawtooth', 0.5, 0.5); }

    function autoShoot() {
        if (gameActive && bullets.length < 3) {
            bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 20, color: '#fffc00' });
            playShootSound();
        }
    }

    setInterval(autoShoot, 333); // Auto shoot three times per second

    function createEnemies() {
        if (gameActive && enemies.length === 0) {
            for (let i = 0; i < 5; i++) {
                enemies.push({ x: i * 60 + 20, y: 30, width: 40, height: 40, color: '#ff00ff' });
            }
        }
    }

    function startGame() {
        gameActive = true;
        startButtonContainer.style.display = 'none';
        userInteracted();
        createEnemies();
        gameLoop();
    }

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawBullets() {
        bullets = bullets.filter(bullet => {
            bullet.y -= bulletVelocity;
            ctx.fillStyle = bullet.color;
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            return bullet.y + bullet.height > 0;
        });
    }

    function drawEnemies() {
        enemies.forEach((enemy, index) => {
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            enemy.y += enemyVelocity;

            if (enemy.y > canvas.height - player.height) {
                playEnemyReachPlayerSound();
                enemies.splice(index, 1);
            }
        });
    }

    function checkCollisions() {
        bullets.forEach((bullet, bulletIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
                    playEnemyHitSound();
                    score += 10;
                    enemies.splice(enemyIndex, 1);
                    bullets.splice(bulletIndex, 1);
                }
            });
        });

        if (enemies.length === 0) {
            setTimeout(createEnemies, 3000); // Wait 3 seconds before spawning a new wave
        }
    }

    function displayScore() {
        ctx.font = '16px "Press Start 2P"';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'right';
        ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
    }

    function gameLoop() {
        if (!gameActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawBullets();
        drawEnemies();
        checkCollisions();
        displayScore();
        requestAnimationFrame(gameLoop);
    }

    window.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (e.key === ' ') e.preventDefault(); // Prevent scrolling with spacebar
    });

    window.addEventListener('keyup', e => {
        keys[e.key] = false;
    });

    canvas.addEventListener('touchmove', e => {
        e.preventDefault(); // Prevent scrolling on mobile
        let touchX = e.touches[0].clientX;
        player.x = touchX - (player.width / 2);
    }, { passive: false });

    function handleKeyboardInput() {
        if (keys['ArrowLeft']) player.x -= 5;
        if (keys['ArrowRight']) player.x += 5;
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    }

    setInterval(() => {
        handleKeyboardInput();
    }, 10);

    startButton.addEventListener('click', startGame);
});
