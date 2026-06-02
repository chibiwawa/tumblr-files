/* --- 1. START FAILSAFE --- */
document.body.classList.add('custom-cursor-active');

// Rain Animation - WITH SAFETY CHECK
const canvas = document.getElementById('tumblrRainCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Rain drops
    const rainDrops = [];

    class RainDrop {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.length = Math.random() * 15 + 10;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.velocity = Math.random() * 7 + 5;
        }

        draw() {
            ctx.strokeStyle = `rgba(200, 200, 255, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.stroke();
        }

        update() {
            this.y += this.velocity;
            
            if (this.y > canvas.height) {
                this.y = -this.length;
                this.x = Math.random() * canvas.width;
            }
        }
    }

    // Initialize rain drops
    function initRain() {
        rainDrops.length = 0;
        for (let i = 0; i < 100; i++) {
            rainDrops.push(new RainDrop());
        }
    }

    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        rainDrops.forEach(drop => {
            drop.update();
            drop.draw();
        });

        requestAnimationFrame(animate);
    }

    // Start animation
    initRain();
    animate();
}
/* --- 3. END FAILSAFE --- */

let hasMoved = false;
document.addEventListener('mousemove', function() { hasMoved = true; }, { once: true });
setTimeout(() => {
    if (!hasMoved) {
        document.body.classList.remove('custom-cursor-active');
        if (cursor) cursor.style.display = 'none';
    }
}, 1500);
