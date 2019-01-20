import { collisionDetection } from "/src/collisionDetection";

export default class Ball {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.size = 12;
    this.position = {
      x: 400,
      y: 350
    };
    this.speed = {
      x: 0,
      y: 5
    };
    this.image = document.getElementById("ball");
    this.game = game;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  update() {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if (this.position.x < 0 || this.position.x + this.size > this.gameWidth) {
      this.speed.x = -this.speed.x;
    }
    if (this.position.y < 0) {
      this.speed.y = -this.speed.y;
    }

    if (this.position.y + this.size > this.gameHeight) {
      this.game.reset();
    }

    if (collisionDetection(this, this.game.paddle) === 2) {
      this.speed.y = -this.speed.y;

      let paddleCenter =
        this.game.paddle.position.x + this.game.paddle.width / 2;
      let ballCenter = this.position.x + this.size / 2;
      let fraction = (ballCenter - paddleCenter) / this.game.paddle.width;
      this.speed.x = Math.floor(10 * fraction);
    }
  }
}
