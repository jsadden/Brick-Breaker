import Game from "/src/game";

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

const GAMEW = canvas.width;
const GAMEH = canvas.height;

let game = new Game(GAMEW, GAMEH);

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
