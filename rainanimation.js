/*  rainani.js  – DOM-based rain, no conflicts */
(() => {

  /* wait until the DOM is ready */
  document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('rain-container');
    if (!container) return;        /* safety check */

    /* how many drops per second */
    const DROP_RATE = 18;          /* ≈ 18 drops / sec  */

    /* create one drop */
    function createDrop(){
        const d   = document.createElement('div');
        const len = 8 + Math.random()*12;      /* 8-20 px */
        const left= Math.random()*100;         /* vw */

        d.className       = 'raindrop';
        d.style.height    = len + 'px';
        d.style.left      = left + 'vw';
        d.style.animationDuration = (.6 + Math.random()*0.6) + 's';
        d.style.opacity   = 0.3 + Math.random()*0.4;  /* 0.3–0.7 */

        container.appendChild(d);

        /* tidy up after the animation finishes */
        setTimeout(() => d.remove(), 2000);
    }

    /* launch drops at the chosen rate */
    setInterval(createDrop, 1000 / DROP_RATE);
  });

})();
