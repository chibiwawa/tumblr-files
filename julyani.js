/* --- 1. START FAILSAFE (leave this part) --- */
document.body.classList.add('custom-cursor-active');

/* --- 2. RAIN + CURSOR  -------------------------------------------------- */
(function(){

/* ---------------  RAIN  --------------- */
function createRaindrop(){
    var box = document.getElementById('sakura-container');      // same div!
    if(!box) return;

    var d   = document.createElement('div');
    var len =  8 + Math.random()*12;        // 8-20 px
    var dur = .50 + Math.random()*0.45;     // 0.50-0.95 s

    d.className = 'raindrop';
    d.style.cssText =
        'position:fixed;pointer-events:none;z-index:9999;' +
        'left:'  + (Math.random()*100) + 'vw;' +
        'top:-25px;' +
        'width:2px;' +
        'height:'+ len +'px;' +
        'background:rgba(180,200,255,.55);' +
        'border-radius:2px;' +
        'filter:drop-shadow(0 0 2px rgba(200,200,255,.6));' +
        'animation:fall ' + dur + 's linear forwards;';

    box.appendChild(d);
    setTimeout(()=> d.remove(), 2000);      // tidy up
}
setInterval(createRaindrop, 60);           // ≈ 16–17 drops / sec


/* ---------------  CURSOR & SPLASH --------------- */
var cursor   = document.getElementById('custom-cursor'),
    cx = 0, cy = 0, ax = 0, ay = 0;

document.addEventListener('mousemove', e=>{
        cx = e.clientX; cy = e.clientY;
        makeSplashDot(e.clientX, e.clientY);
});

function updateCursor(){
    ax += (cx-ax)*0.5; ay += (cy-ay)*0.5;
    if(cursor){ cursor.style.left=ax+'px'; cursor.style.top=ay+'px'; }
    requestAnimationFrame(updateCursor);
}
requestAnimationFrame(updateCursor);

document.addEventListener('mouseover',  e=>{
    if(e.target.closest('a,button,.like_button iframe,li.post img')){
        cursor && cursor.classList.add('hovered');
    }
});
document.addEventListener('mouseout',  e=>{
    if(e.target.closest('a,button,.like_button iframe,li.post img')){
        cursor && cursor.classList.remove('hovered');
    }
});

/* little dot that fades out – looks like water splash */
function makeSplashDot(x,y){
    var s = document.createElement('div');
    var r = 2 + Math.random()*2;            // 2-4 px
    s.style.cssText =
        'position:fixed;pointer-events:none;z-index:2147483645;' +
        'left:'+(x-r)+'px;top:'+(y-r)+'px;' +
        'width:'+ (r*2) +'px;height:'+ (r*2) +'px;' +
        'background:rgba(180,200,255,.8);border-radius:9999px;' +
        'transition:all .4s linear;';
    document.body.appendChild(s);
    requestAnimationFrame(()=>{ s.style.transform='scale(0)'; s.style.opacity='0';});
    setTimeout(()=>s.remove(),450);
}

})();   /* IIFE */

/* --- 3. END FAILSAFE (leave untouched) --- */
