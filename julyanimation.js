/* --- 1. START FAILSAFE --- */
document.body.classList.add('custom-cursor-active');

/* --- 2. YOUR ORIGINAL SAKURA & CURSOR CODE --- */
(function() {
    const canvas = document.getElementById('tumblrRainCanvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const maxDrops = 150; // Adjust this number to make the rain heavier or lighter
    const drops = [];

    // Initialize raindrops
    for (let i = 0; i < maxDrops; i++) {
        drops.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 20 + 10,  // Length of the raindrop
            speed: Math.random() * 15 + 10,  // Falling speed
            opacity: Math.random() * 0.3 + 0.1 // Transparency
        });
    }

    // Resize canvas dynamically if user rotates screen or resizes window
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw and update drops
        for (let i = 0; i < maxDrops; i++) {
            const d = drops[i];
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(174, 194, 224, ${d.opacity})`; // Soft blue/white rain color
            ctx.lineWidth = 1.5;
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x, d.y + d.length); // Draw vertical line
            ctx.stroke();

            // Move the drop down
            d.y += d.speed;

            // Reset drop to the top if it falls off screen
            if (d.y > height) {
                d.y = -d.length;
                d.x = Math.random() * width;
                d.speed = Math.random() * 15 + 10;
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
})();

/* --- 3. END FAILSAFE --- */
let hasMoved = false;
document.addEventListener('mousemove', function() { hasMoved = true; }, { once: true });
setTimeout(() => {
    if (!hasMoved) {
        document.body.classList.remove('custom-cursor-active');
        if (cursor) cursor.style.display = 'none';
    }
}, 1500);
