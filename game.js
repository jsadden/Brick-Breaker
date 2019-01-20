import Paddle from "/src/paddle";
import InputHandler from "/src/input";
import Ball from "/src/ball";
import Brick from "/src/brick";
import Levels from "/src/levels";

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  LOSTLIFE: 4,
  WINGAME: 5
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.levels = new Levels();
    this.gamestate = GAMESTATE.MENU;
    this.paddle = new Paddle(this);
    new InputHandler(this, this.paddle);
    this.ball = new Ball(this);
    this.gameObjects = [];
    this.lives = 3;
    this.currentLevel = 1;
  }

  start() {
    if (this.gamestate !== GAMESTATE.MENU) {
      if (this.gamestate === GAMESTATE.LOSTLIFE) {
        this.gamestate = GAMESTATE.RUNNING;
      }
      return;
    }

    this.gamestate = GAMESTATE.RUNNING;
    let bricks = this.buildLevel(this.levels.level[this.currentLevel - 1]);
    this.gameObjects = [this.paddle, this.ball, ...bricks];
  }

  update() {
    if (
      this.gamestate === GAMESTATE.PAUSED ||
      this.gamestate === GAMESTATE.MENU ||
      this.gamestate === GAMESTATE.GAMEOVER ||
      this.gamestate === GAMESTATE.LOSTLIFE ||
      this.gamestate === GAMESTATE.WINGAME
    )
      return;
    if (this.lives === 0) this.gamestate = GAMESTATE.GAMEOVER;

    this.gameObjects.forEach(object => object.update());

    this.gameObjects = this.gameObjects.filter(
      object => !object.markedForDeletion
    );
    if (this.gameObjects.length === 2) {
      if (this.currentLevel === this.levels.level.length) {
        this.gamestate = GAMESTATE.WINGAME;
      } else {
        this.currentLevel++;
        let bricks = this.buildLevel(this.levels.level[this.currentLevel - 1]);
        this.gameObjects = [this.paddle, this.ball, ...bricks];

        //add two lives, one is taken in reset, the other is awarded for passing level
        this.lives = this.lives + 2;
        this.reset();
      }
    }
  }

  draw(ctx) {
    this.gameObjects.forEach(object => object.draw(ctx));

    if (this.gamestate === GAMESTATE.PAUSED) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "30px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    } else if (this.gamestate === GAMESTATE.MENU) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "30px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(
        "Press SPACE to Begin",
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    } else if (this.gamestate === GAMESTATE.RUNNING) {
      ctx.font = "15px Arial";
      ctx.fillStyle = "#000";

      ctx.fillText(
        "Lives: " + this.lives,
        this.gameWidth * 0.05,
        this.gameHeight * 0.05
      );
    } else if (this.gamestate === GAMESTATE.GAMEOVER) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "40px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
    } else if (this.gamestate === GAMESTATE.LOSTLIFE) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "30px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(
        "Press SPACE to Continue",
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    } else if (this.gamestate === GAMESTATE.WINGAME) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "40px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText(
        "Congratulations! Thanks for playing!",
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    }
  }

  buildLevel(level) {
    let bricks = [];
    let rows = level.length;
    let cols = level[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (level[i][j] === 1) {
          let position = {
            x: 100 + 50 * j,
            y: 50 + 50 * i
          };
          bricks.push(new Brick(this, position));
        }
      }
    }
    return bricks;
  }

  togglePause() {
    if (this.gamestate === GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }

  reset() {
    this.lives -= 1;
    if (this.lives > 0) {
      this.gamestate = GAMESTATE.LOSTLIFE;
    }
    this.ball.position = {
      x: 400,
      y: 350
    };
    this.ball.speed = {
      x: 0,
      y: 5
    };
    this.paddle.position = {
      x: this.gameWidth / 2 - this.paddle.width / 2,
      y: this.gameHeight - this.paddle.height * 2
    };
  }
}
