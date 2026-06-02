/* --- 1. START FAILSAFE --- */
document.body.classList.add('custom-cursor-active');

let hasMoved = false;
document.addEventListener('mousemove', function() { hasMoved = true; }, { once: true });
setTimeout(() => {
    if (!hasMoved) {
        document.body.classList.remove('custom-cursor-active');
        if (cursor) cursor.style.display = 'none';
    }
}, 1500);
/* --- 3. END FAILSAFE --- */
