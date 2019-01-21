export default class Paddle {
  constructor(game) {
    this.gameWidth = game.gameWidth; //width of canvas
    this.width = 80; //width of paddle
    this.height = 10; //height of paddle
    this.position = {
      //intial position of paddle
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight - this.height * 2
    };
    this.maxSpeed = 6; //max moving speed of paddle
    this.speed = 0; //initial moving speed of paddle
    this.color = "#f0f"; //color of paddle, purple
  }

  //////////////////
  //Draw paddle
  //////////////////
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  //////////////////
  //Update paddle position
  //////////////////
  update() {
    this.position.x += this.speed;

    //Check if paddle hits edge of canvas and stop it if it does
    if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.x + this.width > this.gameWidth) {
      this.position.x = this.gameWidth - this.width;
    }
  }

  //Set leftward speed
  moveLeft() {
    this.speed = -this.maxSpeed;
  }

  //Set rightward speed
  moveRight() {
    this.speed = this.maxSpeed;
  }

  //Clear speed
  stop() {
    this.speed = 0;
  }
}
