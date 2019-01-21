import { collisionDetection } from "/src/collisionDetection";

export default class Brick {
  constructor(game, position) {
    this.image = document.getElementById("brick"); //Set image
    this.gameWidth = game.gameWidth; //Canvas width
    this.gameHeight = game.gameHeight; //Canvas height
    this.height = 50; //height of brick
    this.width = 50; //Width of brick
    this.position = position; //Position of brick as set by init
    this.game = game; //Game
    this.markedForDeletion = false; //Init as not marked for deletion, will change if hit
  }
  //////////////////
  //Update brick, determine if hit, change ball direction
  //////////////////
  update() {
    let didCollide = collisionDetection(this.game.ball, this);

    //Top or bottom, reverses y-speed of ball
    if (didCollide === 1 || didCollide === 2) {
      this.game.points += 100;
      this.markedForDeletion = true;
      this.game.ball.speed.y = -this.game.ball.speed.y;
    }

    //Left or right, reverses x-speed of ball
    if (didCollide === 3 || didCollide === 4) {
      this.game.points += 100;
      this.markedForDeletion = true;
      this.game.ball.speed.x = -this.game.ball.speed.x;
    }
  }
  //////////////////
  //Draw brick
  //////////////////
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
