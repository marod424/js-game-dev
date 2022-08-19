import Player from './player.js';
import InputHandler from './input.js';
import { Background } from './background.js'
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';

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
      this.speed = 0;
      this.maxSpeed = 3;
      this.isPaused = false;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
    }

    update(deltatime) {
      this.background.update();
      this.player.update(this.input.keys, deltatime);
      
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltatime;
      }
      this.enemies.forEach(enemy => {
        enemy.update(deltatime);
        if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
      });
    }

    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach(enemy => enemy.draw(context));
    }

    pause() {
      this.isPaused = !this.isPaused;
      if (!this.isPaused) animate(0);
    }

    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      
      this.enemies.push(new FlyingEnemy(this));
      console.log(this.enemies)
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