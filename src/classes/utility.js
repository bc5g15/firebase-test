//group of functions used by all "classes" used to make code a bit tidier and reduce
//code duplication.

export function rotateTo(dx, dy, px, py) {
  var dist_Y = dy - py;
  var dist_X = dx - px;
  var angle = Math.atan2(dist_Y, dist_X);
  return angle;
}

export function calculateDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  );
}

export function canAfford(gameBoard) {
  if (!(gameBoard.score - gameBoard.costOfMovement < 0)) {
    gameBoard.score -= gameBoard.costOfMovement;
    return true;
  } else {
    return false;
  }
}

//calculates the speed missiles should travel with. This needs to be improved so that
//it calculates the correct speed for missiles regardless of screen size and aspect
//ratio
export function calculateMissileSpeed(
  factor,
  gameBoard,
  sizeGridSquareX,
  sizeGridSquareY
) {
  let missileSpeedX = sizeGridSquareX / gameBoard.dimension;
  let missileSpeedY = sizeGridSquareY / gameBoard.dimension;

  return missileSpeedX / missileSpeedY * factor;
}

//returns the grid coordinate for a specific index for an array of a given dimensionality.
export function indexToGridCoord(index, dimension) {
  return [index % dimension, Math.floor(index / dimension)];
}
