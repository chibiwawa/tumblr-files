function createSakura() {
    var container = document.getElementById('sakura-container');
    if (!container) return;
    var petal = document.createElement('div');
    petal.className = 'sakura-petal';
    petal.style.left = (window.innerWidth - Math.random() * 350) + 'px';
    petal.style.top = (window.innerHeight - (230 + Math.random() * 150)) + 'px';
    petal.style.animationDuration = (Math.random() * 8 + 16) + 's';
    petal.style.width = petal.style.height = (10 + Math.random() * 8) + 'px';
    petal.style.background = ['#ffd6e0','#ffcce0','#ffdae8','#ffd1e8','#f4c2d7','#e8b4d9','#ddb8e8','#f0bbe6','#ffc4d6','#ffb8ca','#f7aec4','#edb5d5'][Math.floor(Math.random()*12)];
    container.appendChild(petal);
    setTimeout(function() { if (petal.parentNode) petal.remove(); }, 16000);
}

// THIS IS THE TRIGGER THAT STARTS THE FUNCTION
if (window.location.href.indexOf('customize') === -1) {
    setInterval(createSakura, 800);
}
