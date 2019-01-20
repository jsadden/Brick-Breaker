import { collisionDetection } from "/src/collisionDetection";

export default class Brick {
  constructor(game, position) {
    this.image = document.getElementById("brick");
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.height = 50;
    this.width = 50;
    this.position = position;
    this.game = game;
    this.markedForDeletion = false;
  }

  update() {
    if (collisionDetection(this.game.ball, this) === 1) {
      this.markedForDeletion = true;
      this.game.ball.speed.y = -this.game.ball.speed.y;
    }
    if (collisionDetection(this.game.ball, this) === 2) {
      this.markedForDeletion = true;
      this.game.ball.speed.y = -this.game.ball.speed.y;
    }
    if (collisionDetection(this.game.ball, this) === 3) {
      this.markedForDeletion = true;
      this.game.ball.speed.x = -this.game.ball.speed.x;
    }
    if (collisionDetection(this.game.ball, this) === 4) {
      this.markedForDeletion = true;
      this.game.ball.speed.x = -this.game.ball.speed.x;
    }
  }

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
