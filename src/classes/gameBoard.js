import SquareHighlighter from './highlightedSquare';

export default class GameState {
  constructor(app, dimension, mousePosition) {
    this.app = app;

    this.dimension = dimension; // Grid size e.g. 9
    this.pointArray = [];
    this.costOfMovement = 0;
    this.treasureArray = [];

    this.ships = {};
    this.enemyShips = [];
    this.destroyedShips = [];

    this.id = 0;
    this.score = 20000;
    this.health = 1000;

    this.missiles = [];
    this.missileCount = 0;
    this.missileSpeed = 1;
    this.missileSpeedFactor = 4;

    this.mousePosition = mousePosition;

    this.gameState = [];
    this.squareHighlighter = new SquareHighlighter(app, this);
  }
}
