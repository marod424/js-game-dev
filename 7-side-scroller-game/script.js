window.addEventListener('load', function() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 720;

  const ARROW_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];

  class InputHandler {
    constructor() {
      this.keys = [];

      window.addEventListener('keydown', e => {
        if (ARROW_KEYS.includes(e.key) && this.keys.indexOf(e.key) === -1) this.keys.push(e.key)
        else if (e.key === 'Enter' && gameOver) restartGame();
        else if (e.key === ' ') pauseGame();
      });

      
      window.addEventListener('keyup', e => {
        if (ARROW_KEYS.includes(e.key)) this.keys.splice(this.keys.indexOf(e.key), 1);
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById('playerImage');
      this.frameX = 0;
      this.maxFrame = 8;
      this.frameY = 0;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }

    draw(context) {
      // hit boxes for collision detection
      // context.strokeStyle = 'white';
      // context.strokeRect(this.x, this.y, this.width, this.height);
      // context.beginPath();
      // context.arc(this.x + this.width*0.5, this.y + this.height*0.5, this.width*0.5, 0, Math.PI*2);
      // context.stroke();

      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(input, deltatime, enemies) {
      // collision detection
      enemies.forEach(enemy => {
        const dx = (enemy.x + enemy.width*0.5) - (this.x + this.width*0.5);
        const dy = (enemy.y + enemy.height*0.5) - (this.y + this.height*0.5);
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < enemy.width*0.5 + this.width*0.5) {
          gameOver = true;
        }
      });

      // sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;

        this.frameTimer = 0;
      } else {
        this.frameTimer += deltatime;
      }

      // controls
      if (input.keys.indexOf('ArrowRight') > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf('ArrowLeft') > -1) {
        this.speed = -5;
      } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
        this.vy -= 32;
      } else {
        this.speed = 0;
      }

      // horizontal movement
      this.x += this.speed;

      // horizontal boundary
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

      // vertical movement
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5;
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.maxFrame = 8;
        this.frameY = 0;
      }
      
      // vertical boundary
      if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
    }

    onGround() {
      return this.y >= this.gameHeight - this.height;
    }

    restart() {
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.maxFrame = 8;
      this.frameY = 0;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById('backgroundImage');
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 7;
    }

    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
    }

    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }

    restart() {
      this.x = 0;
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById('enemyImage');
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 8;
      this.markedForDeletion = false;
    }

    draw(context) {
      // hit boxes for collision detection
      // context.strokeStyle = 'white';
      // context.strokeRect(this.x, this.y, this.width, this.height);
      // context.beginPath();
      // context.arc(this.x + this.width*0.5, this.y + this.height*0.5, this.width*0.5, 0, Math.PI*2);
      // context.stroke();

      context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    update(deltatime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;

        this.frameTimer = 0;
      } else {
        this.frameTimer += deltatime;
      }

      this.x -= this.speed;


      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
        score++;
      }
    }
  }

  let pause = false;
  let gameOver = false;
  let enemies = [];
  let score = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;
  
  function handleEnemies(ctx, deltatime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltatime;
    }

    enemies.forEach(enemy => {
      enemy.draw(ctx);
      enemy.update(deltatime);
    });

    enemies = enemies.filter(enemy => !enemy.markedForDeletion);
  }


  function displayStatusText(context) {
    context.textAlign = 'left';
    context.font = '40px Helvetica';
    context.fillStyle = 'black';
    context.fillText('Score: ' + score, 20, 50);
    context.fillStyle = 'white';
    context.fillText('Score: ' + score, 22, 52);

    if (gameOver) {
      context.textAlign = 'center';
      context.fillStyle = 'black';
      context.fillText('GAME OVER, press ENTER to restart!', canvas.width*0.5, 200);
      context.fillStyle = 'white';
      context.fillText('GAME OVER, press ENTER to restart!', canvas.width*0.5 + 2, 202);
    }

    if (pause) {
      context.textAlign = 'center';
      context.fillStyle = 'black';
      context.font = '60px Helvetica';
      context.fillText('| |', canvas.width*0.5, 200);
      context.fillStyle = 'white';
      context.fillText('| |', canvas.width*0.5 + 2, 202); 
    }
  } 
  
  function restartGame() {
    player.restart();
    background.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0);
  }

  function pauseGame() {
    pause = !pause;
    if (!pause) animate(0);
  }

  const fullscreenButton = document.getElementById('fullscreenButton');

  fullscreenButton.addEventListener('click', toggleFullScreen);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch(err => alert(err.message));
    } else {
      document.exitFullscreen();
    }
  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  let lastTime = 0;

  function animate(timestamp) {
    const deltatime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    background.draw(ctx);
    background.update();

    player.draw(ctx);
    player.update(input, deltatime, enemies);
    
    handleEnemies(ctx, deltatime);
    displayStatusText(ctx);

    if(!pause && !gameOver) requestAnimationFrame(animate);
  }

  animate(0);
});