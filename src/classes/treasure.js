import * as PIXI from 'pixi.js';

export default class Treasure {
  constructor(app, gameBoard, coordinates) {
    this.app = app;
    this.gameBoard = gameBoard;

    this.coordinates = coordinates;
  }

  initTreasure() {
    let sprite = PIXI.Sprite.fromImage('static/assets/Sprites/treasure.png');
    sprite.scale.x = 1.5 / this.gameBoard.dimension;
    sprite.scale.y = 1.5 / this.gameBoard.dimension;
    sprite.anchor.set(0.5);
    this.sprite = sprite;

    this._calculatePosition(this.coordinates);

    this.app.stage.addChild(sprite);
  }

  _calculatePosition(coord) {
    let x = this.gameBoard.gameGrid.getPointFromIndex(coord[0]).x;
    let y = this.gameBoard.gameGrid.getPointFromIndex(
      this.gameBoard.dimension * coord[1]
    ).y;

    this.sprite.position.set(x, y);
  }

  collectTreasure() {
    this.app.stage.removeChild(this.sprite);
  }
}

// Initialise treasure
export function initAllTreasure(gameBoard, treasureLocations) {
  // treasureLocations is an array of coordinates for the treasures
  treasureLocations.forEach(location => {
    let coord = [location[0], location[1]];
    // console.log("Treasure Coordinate: " + coord);
    let treasure = new Treasure(gameBoard.app, gameBoard, coord);
    gameBoard.treasureArray.push(treasure);
  });

  // init each Treasure
  gameBoard.treasureArray.forEach(chest => {
    chest.initTreasure();
  });
}

// Called each time ship is moved
export function checkCollectedTreasure(gameBoard, position) {
  gameBoard.treasureArray.forEach(chest => {
    let x = position[0];
    let y = position[1];

    let sx = chest.coordinates[0];
    let sy = chest.coordinates[1];

    if (x === sx && y === sy) {
      console.log('Treasure Collected');
      chest.collectTreasure();
      gameBoard.treasureArray.splice(chest, 1);
      addTreasureToScore(gameBoard);
    }
  });
}

export function addTreasureToScore(gameBoard) {
  gameBoard.score += 200;
  console.log('Treasure score: ' + gameBoard.score);
}
