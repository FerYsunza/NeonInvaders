//
// neonInvaders
//
// By Fer Ysunza, 02/02/24.
//

document.addEventListener('DOMContentLoaded', () => {
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

    let audioContext;

    function userInteracted() {
        // Initialize or resume AudioContext on user interaction
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            createEnemies();
            gameLoop();
        } else if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    function createOscillator(freq, type, duration, decay) {
        if (!audioContext) return; // Ensure audioContext is initialized

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

    function playShootSound() {
        createOscillator(400, 'square', 0.1, 0.1);
    }

    function playEnemyHitSound() {
        createOscillator(150, 'triangle', 0.2, 0.2);
    }

    function playEnemyReachPlayerSound() {
        createOscillator(100, 'sawtooth', 0.5, 0.5);
    }

    setInterval(() => {
        if (bullets.length < 3 && audioContext) {
            autoShoot();
        }
    }, shootInterval);

    function autoShoot() {
        bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20,
            color: '#fffc00',
        });
        playShootSound();
    }

    function drawBullets() {
        bullets = bullets.filter((bullet, index) => {
            bullet.y -= bulletVelocity;
            if (bullet.y + bullet.height < 0) {
                return false;
            }

            ctx.fillStyle = bullet.color;
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

            for (let i = 0; i < enemies.length; i++) {
                let enemy = enemies[i];
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    enemies.splice(i, 1);
                    score += 10;
                    playEnemyHitSound();
                    return false;
                }
            }

            return true;
        });
    }

    function createEnemies() {
        if (enemies.length === 0) {
            for (let i = 0; i < 5; i++) {
                enemies.push({
                    x: i * 60 + 20,
                    y: 30,
                    width: 40,
                    height: 40,
                    color: '#ff00ff',
                });
            }
        }
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            enemy.y += enemyVelocity;

            if (enemy.y > canvas.height - player.height) {
                playEnemyReachPlayerSound();
                // Implement game over or damage to player here
            }
        });
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleKeyboardInput();
        drawPlayer();
        drawBullets();
        drawEnemies();
        displayScore();
        requestAnimationFrame(gameLoop);
    }

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function handleKeyboardInput() {
        if (keys['ArrowLeft']) { player.x -= 5; }
        if (keys['ArrowRight']) { player.x += 5; }
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    }

    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        userInteracted();
        if (e.key === ' ') e.preventDefault();
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        userInteracted();
        let touchX = e.touches[0].clientX;
        player.x = touchX - (player.width / 2);
    }, { passive: false });

    canvas.addEventListener('click', userInteracted);
    canvas.addEventListener('touchstart', userInteracted);

    function displayScore() {
        ctx.font = '16px "Press Start 2P"';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'right';
        ctx.fillText(`Score: ${score}`, canvas.width - 20, 30);
    }
});
