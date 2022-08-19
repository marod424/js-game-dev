import Player from './player.js';
import InputHandler from './input.js';

window.addEventListener('load', function() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 50;
      this.isPaused = false;
      this.player = new Player(this);
      this.input = new InputHandler(this);
    }

    update(deltatime) {
      this.player.update(this.input.keys, deltatime);
    }

    draw(context) {
      this.player.draw(context);
    }

    pause() {
      this.isPaused = !this.isPaused;
      if (!this.isPaused) animate(0);
    }
  }

  const game = new Game(canvas.width, canvas.height);
  console.log(game);
  
  let lastTime = 0;
  function animate(timestamp) {
    const deltatime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltatime);
    game.draw(ctx);
    if (!game.isPaused) requestAnimationFrame(animate);
  }

  animate(0);
});