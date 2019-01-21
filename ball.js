import { collisionDetection } from "/src/collisionDetection";

export default class Ball {
  constructor(game) {
    this.gameWidth = game.gameWidth; //Canvas width
    this.gameHeight = game.gameHeight; //Canvas height
    this.size = 12; //Ball size (h and w)
    this.position = {
      //Ball initial position
      x: 400,
      y: 350
    };
    this.speed = {
      //Ball initial speed, straight down
      x: 0,
      y: 5
    };
    this.image = document.getElementById("ball"); //Set image
    this.game = game; //Game object
  }

  //////////////////
  //Draw ball
  //////////////////
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  //////////////////
  //Update ball, determine if hit something, change ball direction
  //////////////////
  update() {
    //Update position
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    //Check for collisions with edge of canvas
    if (this.position.x < 0 || this.position.x + this.size > this.gameWidth) {
      this.speed.x = -this.speed.x;
    }
    if (this.position.y < 0) {
      this.speed.y = -this.speed.y;
    }

    //Check for collision with bottom of canvas, signalling a loss of life
    if (this.position.y + this.size > this.gameHeight) {
      this.game.reset();
    }

    //Check for collision with paddle, reversing speed according to where on the paddle it hit
    if (collisionDetection(this, this.game.paddle) === 2) {
      this.speed.y = -this.speed.y;

      //This sets horizontal speed according to location on paddle the ball hit
      //The more right of center, the more rightward speed, same goes for left
      let paddleCenter =
        this.game.paddle.position.x + this.game.paddle.width / 2;
      let ballCenter = this.position.x + this.size / 2;
      let fraction = (ballCenter - paddleCenter) / this.game.paddle.width;
      this.speed.x = Math.round(10 * fraction);
    }
  }
}
