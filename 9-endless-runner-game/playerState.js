import { Dust, Fire, Splash } from './particles.js'

export const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
}

class State {
  constructor(state) {
    this.state = state;
  }
}

export class Sitting extends State {
  constructor(player) {
    super('SITTING');
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 4;
    this.player.frameY = 5;
    this.player.game.speed = 0;
  }

  handleInput(input) {
    if (input.includes('ArrowLeft') || input.includes('ArrowRight')) this.player.setState(states.RUNNING);
    else if (input.includes('Shift')) this.player.setState(states.ROLLING);
  }
}

export class Running extends State {
  constructor(player) {
    super('RUNNING');
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 8;
    this.player.frameY = 3;
    this.player.game.speed = this.player.game.maxSpeed * 1;
  }

  handleInput(input) {
    this.player.game.particles.unshift(
      new Dust(
        this.player.game, 
        this.player.x + this.player.width*0.5, 
        this.player.y + this.player.height
      )
    );

    if (input.includes('ArrowDown')) this.player.setState(states.SITTING);
    else if (input.includes('ArrowUp')) this.player.setState(states.JUMPING);
    else if (input.includes('Shift')) this.player.setState(states.ROLLING);
  }
}

export class Jumping extends State {
  constructor(player) {
    super('JUMPING');
    this.player = player;
  }

  enter() {
    if (this.player.onGround()) this.player.vy -= 16;
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = 1;
    this.player.game.speed = this.player.game.maxSpeed * 1;
  }

  handleInput(input) {
    if (this.player.vy > this.player.weight) this.player.setState(states.FALLING);
    else if (input.includes('Shift')) this.player.setState(states.ROLLING);
    else if (input.includes('ArrowDown')) this.player.setState(states.DIVING);
  }
}

export class Falling extends State {
  constructor(player) {
    super('FALLING');
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = 2;
    this.player.game.speed = this.player.game.maxSpeed * 1;
  }

  handleInput(input) {
    if (this.player.onGround()) this.player.setState(states.RUNNING);
    else if (input.includes('ArrowDown')) this.player.setState(states.DIVING);
  }
}

export class Rolling extends State {
  constructor(player) {
    super('ROLLING');
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = 6;
    this.player.game.speed = this.player.game.maxSpeed * 2;
  }

  handleInput(input) {
    this.player.game.particles.unshift(
      new Fire(
        this.player.game, 
        this.player.x + this.player.width*0.5, 
        this.player.y + this.player.height*0.5
      )
    );

    if (!input.includes('Shift') && this.player.onGround()) this.player.setState(states.RUNNING);
    else if (!input.includes('Shift') && !this.player.onGround()) this.player.setState(states.FALLING);
    else if (input.includes('ArrowUp') && this.player.onGround()) this.player.setState(states.JUMPING);
    else if (input.includes('ArrowDown') && !this.player.onGround()) this.player.setState(states.DIVING);
  }
}

export class Diving extends State {
  constructor(player) {
    super('DIVING');
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = 6;
    this.player.game.speed = 0;
    this.player.vy = 10;
  }

  handleInput(input) {
    this.player.game.particles.unshift(
      new Fire(
        this.player.game, 
        this.player.x + this.player.width*0.5, 
        this.player.y + this.player.height*0.5
      )
    );

    if (this.player.onGround()) {
      this.player.setState(states.RUNNING);

      for (let i = 0; i < 30; i++) {
        this.player.game.particles.unshift(
          new Splash(
            this.player.game, 
            this.player.x + this.player.width*0.5, 
            this.player.y + this.player.height
          )
        );
      }
    }
    else if (input.includes('Shift') && this.player.onGround()) this.player.setState(states.ROLLING);
  }
}

export class Hit extends State {
  constructor(player) {
    super('HIT');
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 10;
    this.player.frameY = 4;
    this.player.game.speed = 0;
  }

  handleInput(_input) {
    if (this.player.frameX >= 10 && this.player.onGround()) this.player.setState(states.RUNNING);
    else if (this.player.frameX >= 10 && !this.player.onGround()) this.player.setState(states.FALLING);
  }
}