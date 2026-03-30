
var c = document.getElementById('crosshair');
c.style.width = '22px';
c.style.height = '22px';
document.addEventListener('mousemove', function(e){
  c.style.left = (e.clientX - 11) + 'px';
  c.style.top = (e.clientY - 11) + 'px';
});
