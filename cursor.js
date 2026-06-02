/* --- 1. START FAILSAFE --- */
document.body.classList.add('custom-cursor-active');

/* --- 2. CURSOR TRACKING CODE --- */
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

/* --- 3. END FAILSAFE --- */
