function createSakura() {
    var container = document.getElementById('sakura-container');
    if (!container) return;
    var petal = document.createElement('div');
    petal.className = 'sakura-petal';
    petal.style.left = (Math.random() * window.innerWidth * 0.6) + 'px';
    petal.style.top = (-10 + Math.random() * 60) + 'px';
    petal.style.animationDuration = (Math.random() * 10 + 20) + 's';
    var size = 8 + Math.random() * 10;
    petal.style.width = size + 'px';
    petal.style.height = (size * 1.4) + 'px';
    petal.style.background = [
        '#d396ff','#c77dff','#e0aaff','#b388ff',
        '#ce93d8','#dbb2ff','#c9a0dc','#e1bee7',
        '#d1c4e9','#b39ddb','#f3e5f5','#e8b4d9'
    ][Math.floor(Math.random() * 12)];
    container.appendChild(petal);
    setTimeout(function() { if (petal.parentNode) petal.remove(); }, 31000);
}
setInterval(createSakura, 800);

var cursor = document.getElementById('custom-cursor');
var cursorX = 0, cursorY = 0;
var actualX = 0, actualY = 0;

document.addEventListener('mousemove', function(e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function updateCursor() {
    actualX += (cursorX - actualX) * 0.5;
    actualY += (cursorY - actualY) * 0.5;
    if (cursor) {
        cursor.style.left = actualX + 'px';
        cursor.style.top = actualY + 'px';
    }
    requestAnimationFrame(updateCursor);
}
requestAnimationFrame(updateCursor);

document.addEventListener('mouseover', function(e) {
    if (e.target.closest('a, button, .like_button iframe, li.post img')) {
        if (cursor) cursor.classList.add('hovered');
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.closest('a, button, .like_button iframe, li.post img')) {
        if (cursor) cursor.classList.remove('hovered');
    }
});

(function() {
    var petals = [];
    var maxPetals = 10;
    var colors = ['#d396ff','#c77dff','#e0aaff','#b388ff','#ce93d8','#dbb2ff','#c9a0dc','#e1bee7','#d1c4e9','#b39ddb','#f3e5f5','#e8b4d9'];

    document.addEventListener('mousemove', function(e) {
        if (Math.random() > 0.5) return;

        var petal = document.createElement('div');
        var size = Math.random() * 5 + 4;
        var color = colors[Math.floor(Math.random() * colors.length)];

        petal.style.cssText =
            'position:fixed;pointer-events:none;z-index:2147483645;' +
            'width:' + size + 'px;height:' + (size * 1.4) + 'px;' +
            'left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
            'background:' + color + ';opacity:0.7;' +
            'clip-path:polygon(50% 0%,80% 30%,70% 80%,50% 100%,30% 80%,20% 30%);';

        document.body.appendChild(petal);
        petals.push(petal);

        if (petals.length > maxPetals) {
            var old = petals.shift();
            if (old.parentNode) old.remove();
        }

        var startX = e.clientX;
        var startY = e.clientY;
        var drift = Math.random() * 30 - 15;
        var rotation = Math.random() * 360;
        var start = performance.now();
        var duration = 800 + Math.random() * 400;

        function animate(time) {
            var p = (time - start) / duration;
            if (p > 1) {
                if (petal.parentNode) petal.remove();
                var idx = petals.indexOf(petal);
                if (idx > -1) petals.splice(idx, 1);
                return;
            }

            petal.style.left = (startX + drift * p) + 'px';
            petal.style.top = (startY + 30 * p) + 'px';
            petal.style.opacity = 0.7 * (1 - p);
            petal.style.transform = 'rotate(' + (rotation + p * 180) + 'deg) scale(' + (1 - p * 0.5) + ')';

            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    });
})();
