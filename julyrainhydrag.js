document.addEventListener('DOMContentLoaded', function() {

    // --- 1. THE CURSOR ENGINE (DONUT FIX) ---
    var cursor = document.getElementById('custom-cursor');
    var mouseX = 0, mouseY = 0;
    var posX = 0, posY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (Math.random() > 0.85) { createTrailItem(e.clientX, e.clientY); }
    });

    function animateCursor() {
        posX += (mouseX - posX) * 0.2;
        posY += (mouseY - posY) * 0.2;
        if (cursor) {
            cursor.style.left = posX + 'px';
            cursor.style.top = posY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('a, button, .like_button, iframe, .reblog-btn, .tag-toggle, img')) {
            if (cursor) cursor.classList.add('hovered');
        }
    });
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('a, button, .like_button, iframe, .reblog-btn, .tag-toggle, img')) {
            if (cursor) cursor.classList.remove('hovered');
        }
    });

    // --- 2. TRAIL FUNCTIONS (PETALS & LEAVES) ---
    function createTrailItem(x, y) {
        var item = document.createElement('div');
        var isLeaf = Math.random() > 0.7;
        item.className = isLeaf ? 'hydrangea-leaf' : 'hydrangea-petal';
        
        if(!isLeaf) {
            var colors = ['#a2c2e8', '#bbd4f1', '#9ab7d3', '#c5d9ed'];
            item.style.background = colors[Math.floor(Math.random() * colors.length)];
        }

        item.style.left = x + 'px';
        item.style.top = y + 'px';
        document.body.appendChild(item);

        var start = performance.now();
        var duration = 1000 + Math.random() * 500;
        var driftX = (Math.random() - 0.5) * 50;
        var driftY = 30 + Math.random() * 50;
        var rotation = Math.random() * 360;

        function animateTrail(time) {
            var p = (time - start) / duration;
            if (p > 1) { item.remove(); return; }
            item.style.transform = 'translate(' + (driftX * p) + 'px, ' + (driftY * p) + 'px) rotate(' + (rotation + p * 100) + 'deg)';
            item.style.opacity = 0.8 * (1 - p);
            requestAnimationFrame(animateTrail);
        }
        requestAnimationFrame(animateTrail);
    }

    // --- 3. THE RAIN ENGINE ---
    function createRain() {
        var container = document.getElementById('sakura-container');
        if (!container) return;
        var drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = (Math.random() * window.innerWidth) + 'px';
        drop.style.top = '-70px';
        var duration = Math.random() * 1000 + 1800; 
        container.appendChild(drop);
        var fall = drop.animate([
            { transform: 'translateY(0)' },
            { transform: 'translateY(' + (window.innerHeight + 70) + 'px)' }
        ], { duration: duration, easing: 'linear' });
        fall.onfinish = function() { drop.remove(); };
    }
    setInterval(createRain, 35);

    // --- 4. WATER SPLASH ON CLICK ---
    document.addEventListener('mousedown', function(e) {
        var splash = document.createElement('div');
        splash.className = 'rain-splash';
        splash.style.left = e.clientX + 'px';
        splash.style.top = e.clientY + 'px';
        document.body.appendChild(splash);
        
        for(var i=0; i<4; i++) { createDroplet(e.clientX, e.clientY); }
        setTimeout(function() { splash.remove(); }, 500);
    });

    function createDroplet(x, y) {
        var drop = document.createElement('div');
        drop.style.cssText = 'position:fixed; width:3px; height:3px; background:#aee2ff; border-radius:50%; z-index:2147483647; pointer-events:none;';
        drop.style.left = x + 'px';
        drop.style.top = y + 'px';
        document.body.appendChild(drop);
        
        var angle = Math.random() * Math.PI * 2;
        var dist = 20 + Math.random() * 30;
        
        drop.animate([
            { transform: 'translate(0,0)', opacity: 1 },
            { transform: 'translate(' + (Math.cos(angle)*dist) + 'px, ' + (Math.sin(angle)*dist - 20) + 'px)', opacity: 0 }
        ], { duration: 500, easing: 'ease-out' }).onfinish = function() { drop.remove(); };
    }
}); // End of wrapper
