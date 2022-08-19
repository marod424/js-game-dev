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
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.isPaused = false;
    }

    update() {
      this.player.update(this.input.keys);
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
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    if (!game.isPaused) requestAnimationFrame(animate);
  }

  animate(0);
});