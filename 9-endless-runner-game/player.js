export default class Player {
  constructor(game) {
    this.game = game;
    this.image = document.getElementById('player');
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.speed = 0;
    this.maxSpeed = 10;
    this.y = this.game.height - this.height;
    this.vy = 0;
    this.weight = 1;
    this.frameX = 0;
    this.frameY = 0;
  }

  update(input) {
    // horizontal movement
    this.x += this.speed;
    if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
    else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
    else this.speed = 0;

    // horizontal boundry
    if (this.x < 0) this.x = 0;
    else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

    // vertical movement
    if (input.includes('ArrowUp') && this.onGround()) this.vy -= 30;
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;
  }

  draw(context) {
    context.drawImage(
      this.image, 
      this.frameX * this.width, this.frameY * this.height, this.width, this.height,
      this.x, this.y, this.width, this.height
    );
  }

  onGround() {
    return this.y >= this.game.height - this.height;
  }
}