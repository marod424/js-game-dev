window.addEventListener('load', function() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 720;

  let pause = false;
  const pauseBtn = document.getElementById('pauseBtn');
  pauseBtn.addEventListener('click', function() {
    pause = !pause;
    pauseBtn.innerHTML = !pause ? 'Pause' : 'Play';
    if (!pause) animate(0);
  });

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    console.log(timestamp)

    if(!pause) requestAnimationFrame(animate);
  }

  animate(0);
});