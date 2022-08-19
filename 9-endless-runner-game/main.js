import UI from './ui.js';
import Player from './player.js';
import InputHandler from './input.js';
import Background from './background.js'
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
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 3;
      this.isPaused = false;
      this.debug = false;
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.maxParticles = 200;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.score = 0;
      this.fontColor = 'black';
      this.time = 0;
      this.maxTime = 10000;
      this.gameOver = false;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
    }

    update(deltatime) {
      this.time += deltatime;
      if (this.time > this.maxTime) this.gameOver = true;

      this.background.update();
      this.player.update(this.input.keys, deltatime);
      
      // handle enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltatime;
      }
      this.enemies.forEach((enemy, index) => {
        enemy.update(deltatime);
        if (enemy.markedForDeletion) this.enemies.splice(index, 1);
      });

      // handle particles
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) this.particles.splice(index, 1);
      });

      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      // handle collisions
      this.collisions.forEach((collision, index) => {
        collision.update(deltatime);
        if (collision.markedForDeletion) this.collisions.splice(index, 1);
      })
    }

    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach(enemy => enemy.draw(context));
      this.particles.forEach(particle => particle.draw(context));
      this.collisions.forEach(collision => collision.draw(context));
      this.ui.draw(context);
    }

    pause() {
      this.isPaused = !this.isPaused;
      if (!this.isPaused) animate(0);
    }

    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));

      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);
  
  let lastTime = 0;
  function animate(timestamp) {
    const deltatime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltatime);
    game.draw(ctx);
    if (!game.isPaused && !game.gameOver) requestAnimationFrame(animate);
  }

  animate(0);
});