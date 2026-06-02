/* --- 1. START FAILSAFE --- */
document.body.classList.add('custom-cursor-active');

/* --- 2. RAIN ANIMATION CODE --- */
function createRaindrop() {
    var container = document.getElementById('sakura-container');
    if (!container) return;
    
    var drop = document.createElement('div');
    drop.className = 'raindrop';
    drop.style.left = (Math.random() * window.innerWidth) + 'px';
    drop.style.top = (-10) + 'px';
    drop.style.width = '1px';
    drop.style.height = (Math.random() * 10 + 5) + 'px';
    drop.style.background = 'rgba(200, 200, 255, ' + (Math.random() * 0.5 + 0.3) + ')';
    drop.style.position = 'fixed';
    drop.style.pointerEvents = 'none';
    drop.style.zIndex = '9999';
    drop.style.animationDuration = (Math.random() * 0.3 + 0.5) + 's';
    
    container.appendChild(drop);
    
    setTimeout(function() {
        if (drop.parentNode) drop.remove();
    }, 2000);
}

setInterval(createRaindrop, 50);

/* --- 3. END FAILSAFE --- */
let hasMoved = false;
document.addEventListener('mousemove', function() { hasMoved = true; }, { once: true });
setTimeout(() => {
    if (!hasMoved) {
        document.body.classList.remove('custom-cursor-active');
        if (cursor) cursor.style.display = 'none';
    }
}, 1500);
