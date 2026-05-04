function createSakura() {
    var container = document.getElementById('sakura-container');
    if (!container) return;
    var petal = document.createElement('div');
    petal.className = 'sakura-petal';
    // start from the top-left area, spread across the top
    petal.style.left = (Math.random() * window.innerWidth * 0.6) + 'px';
    petal.style.top = (-10 + Math.random() * 60) + 'px';
    petal.style.animationDuration = (Math.random() * 6 + 12) + 's';
    var size = 8 + Math.random() * 10;
    petal.style.width = size + 'px';
    petal.style.height = (size * 1.4) + 'px'; // elongated for wisteria
    // wisteria colors - purples, lavenders, lilacs
    petal.style.background = [
        '#d396ff','#c77dff','#e0aaff','#b388ff',
        '#ce93d8','#dbb2ff','#c9a0dc','#e1bee7',
        '#d1c4e9','#b39ddb','#f3e5f5','#e8b4d9'
    ][Math.floor(Math.random() * 12)];
    container.appendChild(petal);
    setTimeout(function() { if (petal.parentNode) petal.remove(); }, 18000);
}
setInterval(createSakura, 800);
