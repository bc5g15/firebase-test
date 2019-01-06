// Group of functions used by all "classes" used to make code a bit tidier and reduce
// code duplication.

// Returns the angle from position P pointing towards position D
export function rotateTo(dX, dY, pX, pY) {
  let dist_Y = dY - pY;
  let dist_X = dX - pX;
  return Math.atan2(dist_Y, dist_X);
}

// Calculate euclidean distance between two 2D points
export function calculateDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  );
}

export function canAfford(gameBoard) {
  if (gameBoard.score - gameBoard.costOfMovement >= 0) {
    gameBoard.score -= gameBoard.costOfMovement;
    return true;
  }
}

// Calculates the speed missiles should travel with. This needs to be improved so that
// it calculates the correct speed for missiles regardless of screen size and aspect
// ratio
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

// Converts 1D coordinate to 2D coordinate based on dimensionality e.g. 4x4, input: 6 output: [2, 1]
export function indexToGridCoord(index, dimension) {
  return [index % dimension, Math.floor(index / dimension)];
}
