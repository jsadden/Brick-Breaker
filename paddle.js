export default class Paddle {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.width = 80;
    this.height = 10;
    this.position = {
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight - this.height * 2
    };
    this.maxSpeed = 6;
    this.speed = 0;
    this.color = "#f0f";
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.x += this.speed;

    if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.x + this.width > this.gameWidth) {
      this.position.x = this.gameWidth - this.width;
    }
  }

  moveLeft() {
    this.speed = -this.maxSpeed;
  }

  moveRight() {
    this.speed = this.maxSpeed;
  }

  stop() {
    this.speed = 0;
  }
}
