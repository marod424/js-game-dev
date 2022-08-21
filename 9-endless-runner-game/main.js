import UI from './ui.js';
import Player from './player.js';
import InputHandler from './input.js';
import Background from './background.js'
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';

window.addEventListener('load', function() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 900;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 50;
      this.speed = 0;
      this.maxSpeed = 3;
      this.isPaused = false;
      this.debug = false;
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.maxParticles = 200;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.score = 0;
      this.winningScore = 40;
      this.fontColor = 'black';
      this.time = 0;
      this.maxTime = 30000;
      this.gameOver = false;
      this.lives = 5;
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

      this.enemies.forEach(enemy => enemy.update(deltatime));
      this.floatingMessages.forEach(message => message.update());
      this.particles.forEach(particle => particle.update());
      this.collisions.forEach(collision => collision.update(deltatime))
      
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }
      
      this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
      this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
      this.particles = this.particles.filter(particle => !particle.markedForDeletion);
      this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
    }

    draw(context) {
      [
        this.background, 
        this.player,
        ...this.enemies,
        ...this.particles,
        ...this.collisions,
        ...this.floatingMessages,
        this.ui
      ].forEach(object => object.draw(context));
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