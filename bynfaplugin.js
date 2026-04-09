var $cursor = $('#custom-cursor');

$(document).on('mousemove', function(e) {
    $cursor.css({
        left: e.clientX + 'px',
        top: e.clientY + 'px'
    });
});

$(document).on('mouseenter', 'a, button, .like_button iframe, li.post img', function() {
    $cursor.addClass('hovered');
});

$(document).on('mouseleave', 'a, button, .like_button iframe, li.post img', function() {
    $cursor.removeClass('hovered');
});

(function(){
  var links = document.querySelector('ul.sidelinks');
  if(!links) return;
  links.style.position = 'relative';
  links.style.overflow = 'hidden';

  var activeBubbles = [];

  function getBounds(){
    var items = links.querySelectorAll('li');
    if(!items.length) return null;
    var linkRect = links.getBoundingClientRect();
    var firstRect = items[0].getBoundingClientRect();
    var lastRect = items[items.length - 1].getBoundingClientRect();
    return {
      left: firstRect.left - linkRect.left,
      right: lastRect.right - linkRect.left,
      top: firstRect.top - linkRect.top,
      bottom: lastRect.bottom - linkRect.top
    };
  }

  function overlaps(x, y, size){
    for(var i = 0; i < activeBubbles.length; i++){
      var a = activeBubbles[i];
      var dx = x - a.x;
      var dy = y - a.y;
      var minDist = (size + a.size) / 2 + 2;
      if(Math.sqrt(dx*dx + dy*dy) < minDist) return true;
    }
    return false;
  }

  function makeBubble(){
    var bounds = getBounds();
    if(!bounds) return;

    var areaW = bounds.right - bounds.left;
    var areaH = bounds.bottom - bounds.top;
    var size = Math.random() * 8 + 5;
    var attempts = 0;
    var startX, startY;

    do {
      startX = bounds.left + size/2 + Math.random() * (areaW - size);
      startY = bounds.top + Math.random() * areaH;
      attempts++;
      if(attempts > 20){
        size = Math.max(size - 1, 4);
        attempts = 0;
      }
      if(size < 4) return;
    } while(overlaps(startX, startY, size));

    var b = document.createElement('div');
    var duration = Math.random() * 8000 + 6000;
    var sway = Math.random() * 2 - 1;

    b.style.cssText =
      'position:absolute;pointer-events:none;border-radius:50%;z-index:0;' +
      'width:' + size + 'px;height:' + size + 'px;' +
      'left:' + (startX - size/2) + 'px;' +
      'top:' + (bounds.bottom) + 'px;opacity:0;' +
      'background:' +
        'radial-gradient(circle at 30% 25%,' +
          'rgba(255,255,255,0.9) 0%,' +
          'rgba(255,255,255,0.4) 5%,' +
          'transparent 15%),' +
        'conic-gradient(from 0deg,' +
          'rgba(255,100,100,0.5),' +
          'rgba(255,200,50,0.5),' +
          'rgba(100,255,100,0.5),' +
          'rgba(50,200,255,0.5),' +
          'rgba(150,100,255,0.5),' +
          'rgba(255,100,200,0.5),' +
          'rgba(255,100,100,0.5));' +
      'border:1px solid rgba(255,255,255,0.5);' +
      'box-shadow:' +
        'inset 0 0 ' + (size/3) + 'px rgba(255,255,255,0.3),' +
        '0 0 ' + (size/4) + 'px rgba(255,255,255,0.2);';

    links.appendChild(b);

    var bubbleData = {x: startX, y: bounds.bottom, size: size, el: b};
    activeBubbles.push(bubbleData);

    var start = performance.now();

    function animate(time){
      var p = (time - start) / duration;
      if(p > 1){
        b.remove();
        var idx = activeBubbles.indexOf(bubbleData);
        if(idx > -1) activeBubbles.splice(idx, 1);
        return;
      }

      var y = areaH * p;
      var x = Math.sin(p * Math.PI * 2) * sway;
      var newLeft = startX - size/2 + x;
      newLeft = Math.max(bounds.left, Math.min(newLeft, bounds.right - size));
      var newTop = bounds.bottom - y - size;
      newTop = Math.max(bounds.top, newTop);
      var o = p < 0.1 ? p * 8 : (p > 0.9 ? (1 - p) * 8 : 0.6);

      b.style.top = newTop + 'px';
      b.style.left = newLeft + 'px';
      b.style.opacity = o;
      b.style.transform = 'rotate(' + (p * 180) + 'deg)';

      bubbleData.x = newLeft + size/2;
      bubbleData.y = newTop + size/2;

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  for(var i = 0; i < 2; i++) setTimeout(makeBubble, i * 600);
  setInterval(makeBubble, 1500);
})();
(function() {
    var petals = [];
    var maxPetals = 20;
    var colors = ['#ffd6e0','#ffcce0','#ffdae8','#ffd1e8','#f4c2d7','#e8b4d9','#ddb8e8','#f0bbe6','#ffc4d6','#ffb8ca','#f7aec4','#edb5d5'];

    $(document).on('mousemove', function(e) {
        if (Math.random() > 0.3) return;

        var petal = document.createElement('div');
        var size = Math.random() * 8 + 6;
        var color = colors[Math.floor(Math.random() * colors.length)];

        petal.style.cssText =
            'position:fixed;pointer-events:none;z-index:2147483645;' +
            'width:' + size + 'px;height:' + size + 'px;' +
            'left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
            'background:' + color + ';opacity:0.7;' +
            'clip-path:polygon(50% 0%,100% 35%,80% 100%,50% 80%,20% 100%,0% 35%);';

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
