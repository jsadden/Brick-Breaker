export function collisionDetection(ball, object) {
  //Ball sides
  let ballBottom = ball.position.y + ball.size;
  let ballTop = ball.position.y;
  let ballLeft = ball.position.x;
  let ballRight = ball.position.x + ball.size;

  //Object sides
  let objectTop = object.position.y;
  let objectLeft = object.position.x;
  let objectRight = object.position.x + object.width;
  let objectBottom = object.position.y + object.height;

  //detect Top of ball collision
  if (
    ballBottom >= objectBottom &&
    ballTop <= objectBottom &&
    ballLeft >= objectLeft &&
    ballRight <= objectRight
  ) {
    return 1;
  }
  if (
    //detect bottom of ball collision
    ballBottom >= objectTop &&
    ballTop <= objectTop &&
    ballLeft >= objectLeft &&
    ballRight <= objectRight
  ) {
    return 2;
  }
  if (
    //detect left of ball collision
    ballBottom <= objectBottom &&
    ballTop >= objectTop &&
    ballLeft <= objectRight &&
    ballRight >= objectRight
  ) {
    return 3;
  }
  if (
    //detect right of ball collision
    ballBottom <= objectBottom &&
    ballTop >= objectTop &&
    ballLeft <= objectLeft &&
    ballRight >= objectLeft
  ) {
    return 4;
  }
}
