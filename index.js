import Game from "/src/game";

//game context
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

//height and width of canvas
const GAMEW = canvas.width;
const GAMEH = canvas.height;

//intiialize the game
let game = new Game(GAMEW, GAMEH);

//game loop, clears canvas then redraws game
let lastTime = 0;
function loop(timeStamp) {
  let dt = timeStamp - lastTime;
  lastTime = timeStamp;

  ctx.clearRect(0, 0, GAMEW, GAMEH);

  game.update();
  game.draw(ctx);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
