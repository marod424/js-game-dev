import { states, Sitting, Running, Jumping, Falling, Rolling } from './playerState.js';

export default class Player {
  constructor(game) {
    this.game = game;
    this.image = document.getElementById('player');
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 5;
    this.fps = 20;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = 4;
    this.vy = 0;
    this.weight = 0.375 ;
    this.states = [
      new Sitting(this),
      new Running(this),
      new Jumping(this),
      new Falling(this),
      new Rolling(this),
    ];
    this.currentState = this.states[states.SITTING];
    this.currentState.enter();
  }

  update(input, deltatime) {
    this.checkCollision();
    this.currentState.handleInput(input);

    // horizontal movement
    this.x += this.speed;
    if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
    else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
    else this.speed = 0;

    // horizontal boundry
    if (this.x < 0) this.x = 0;
    else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

    // vertical movement
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltatime;
    }
  }

  draw(context) {
    if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);

    context.drawImage(
      this.image, 
      this.frameX * this.width, this.frameY * this.height, this.width, this.height,
      this.x, this.y, this.width, this.height
    );
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  checkCollision() {
    this.game.enemies.forEach(enemy => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        // collision detected
        enemy.markedForDeletion = true;
        this.game.score++;
      } else {
        // no collision
      }
    });
  }
}