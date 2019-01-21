export default class InputHandler {
  constructor(game, paddle) {
    document.addEventListener("keydown", event => {
      switch (event.keyCode) {
        case 37: //Left Key, moves paddle left
          paddle.moveLeft();
          break;
        case 39: //Right key, moves paddle right
          paddle.moveRight();
          break;
        case 27: //ESC key, toggles pause state
          game.togglePause();
          break;
        case 32: //SPACE key, triggered when in menu of loss of life states
          game.start();
          break;
      }
    });

    //Keyup on Left and Right keys to stop motion when key is not pressed
    //Also checks direction of motion to avoid jerky paddle movement
    document.addEventListener("keyup", event => {
      switch (event.keyCode) {
        case 37:
          if (paddle.speed < 0) paddle.stop();
          break;
        case 39:
          if (paddle.speed > 0) paddle.stop();
          break;
      }
    });
  }
}
