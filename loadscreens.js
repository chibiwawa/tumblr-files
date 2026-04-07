var loader = document.getElementById('loading-screen');
if (loader) {
    function hideLoader() {
        setTimeout(function() {
            loader.classList.add('fade-out');
            setTimeout(function() {
                if (loader.parentNode) loader.parentNode.removeChild(loader);
                document.body.classList.add('page-ready');
            }, 600);
        }, 800);
    }
    if (document.readyState === 'complete') hideLoader();
    else if (document.readyState === 'interactive') hideLoader();
    else window.addEventListener('DOMContentLoaded', hideLoader);
}

$(document).on('click', 'a[href*="tumblr.com"]', function(e) {
    var url = this.href;
    if (url.includes(window.location.hostname) || this.target === '_blank') return;
    e.preventDefault();
    var exit = document.getElementById('exit-screen');
    exit.style.display = 'flex';
    requestAnimationFrame(function() { exit.classList.add('visible'); });
    setTimeout(function() { window.location.href = url; }, 500);
});
