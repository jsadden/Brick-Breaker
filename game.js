import Paddle from "/src/paddle";
import InputHandler from "/src/input";
import Ball from "/src/ball";
import Brick from "/src/brick";
import Levels from "/src/levels";

//gamestates
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
    this.gameWidth = gameWidth; //canvas width
    this.gameHeight = gameHeight; //canvas height
    this.levels = new Levels(); //load levels
    this.gamestate = GAMESTATE.MENU; //init game at menu
    this.paddle = new Paddle(this); //init paddle
    new InputHandler(this, this.paddle); //init inputs
    this.ball = new Ball(this); //init ball
    this.gameObjects = []; //initialize array
    this.lives = 3; //number of lives
    this.currentLevel = 1; //starting level
    this.points = 0; //user score
    this.backgroundImage = document.getElementById("backgroundImg");
  }
  //////////////////
  //Initialize game, build level
  //////////////////
  start() {
    //Only menu gamestate can start the game with SPACE
    //Lostlife gamestate also uses SPACE to continue, this
    //changes it to Running
    if (this.gamestate !== GAMESTATE.MENU) {
      if (this.gamestate === GAMESTATE.LOSTLIFE) {
        this.gamestate = GAMESTATE.RUNNING;
      }
      return;
    }

    //build level and add objects to array
    this.gamestate = GAMESTATE.RUNNING;
    let bricks = this.buildLevel(this.levels.level[this.currentLevel - 1]);
    this.gameObjects = [this.paddle, this.ball, ...bricks];
  }

  //////////////////
  //Update game, check if level complete
  //////////////////
  update() {
    //do not update if game is not in running gamestate
    if (
      this.gamestate === GAMESTATE.PAUSED ||
      this.gamestate === GAMESTATE.MENU ||
      this.gamestate === GAMESTATE.GAMEOVER ||
      this.gamestate === GAMESTATE.LOSTLIFE ||
      this.gamestate === GAMESTATE.WINGAME
    )
      return;

    //set Gameover if no lives left
    if (this.lives === 0) this.gamestate = GAMESTATE.GAMEOVER;

    //call update function of each object
    this.gameObjects.forEach(object => object.update());

    //delete objects (bricks) which have been marked for deletion
    //by a hit
    this.gameObjects = this.gameObjects.filter(
      object => !object.markedForDeletion
    );

    //check for level comlpetion, should have only paddle and ball
    if (this.gameObjects.length === 2) {
      //check for End of game by completing the last level
      if (this.currentLevel === this.levels.level.length) {
        this.gamestate = GAMESTATE.WINGAME;
      } else {
        //increment and build next level
        this.currentLevel++;
        let bricks = this.buildLevel(this.levels.level[this.currentLevel - 1]);
        this.gameObjects = [this.paddle, this.ball, ...bricks];

        //add two lives, one is taken in reset, the other is awarded for passing level
        this.lives = this.lives + 2;
        this.reset();
      }
    }
  }

  //////////////////
  //Draw game based on current gamestate
  //////////////////
  draw(ctx) {
    //Draw background
    ctx.drawImage(this.backgroundImage, 0, 0, this.gameWidth, this.gameHeight);

    //Call draw function of each object
    this.gameObjects.forEach(object => object.draw(ctx));

    //Paused, should stop motion and darken screen
    if (this.gamestate === GAMESTATE.PAUSED) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "30px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);

      //Menu, should be the first thing that appers when game is initialized
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
      //Running, normal state that displays lives
    } else if (this.gamestate === GAMESTATE.RUNNING) {
      ctx.textAlign = "left";
      ctx.font = "15px Arial";
      ctx.fillStyle = "#000";
      ctx.fillText(
        "Lives: " + this.lives,
        this.gameWidth * 0.05,
        this.gameHeight * 0.05
      );
      ctx.fillText(
        "Level: " + this.currentLevel,
        this.gameWidth * 0.05,
        this.gameHeight * 0.08
      );
      ctx.textAlign = "right";
      ctx.fillText(
        "Score: " + this.points,
        this.gameWidth * 0.95,
        this.gameHeight * 0.05
      );

      //Game over, stops game and displays black
    } else if (this.gamestate === GAMESTATE.GAMEOVER) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "40px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);

      //Lost a life, looks like menu and resets positions
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
      //Win the game, display white congratulatory message
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

  //////////////////
  //Build level, takes level array as input and determines brick placement
  //////////////////
  buildLevel(level) {
    let bricks = [];
    let rows = level.length;
    let cols = level[0].length;

    //iterate through array and add a brick when the element is 1
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (level[i][j] === 1) {
          //Bricks are 50px X 50px, this places this accordingly
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

  //////////////////
  //Toggle pause gamestate, triggered by ESC
  //////////////////
  togglePause() {
    if (this.gamestate === GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }

  //////////////////
  //Reset pieces if there is a remaining life, change gamestate
  //////////////////
  reset() {
    //decrease lives and check if any left
    this.lives -= 1;
    if (this.lives > 0) {
      this.gamestate = GAMESTATE.LOSTLIFE;
    }
    //reset positions and speeds
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
