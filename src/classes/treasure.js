import * as PIXI from 'pixi.js';
import * as util from './utility';

export default class Treasure {
  constructor(app, gameBoard, coordinates) {
    this.app = app;
    this.position = null;
    this.sprite = null;
    this.gameBoard = gameBoard;
    this.coordinates = coordinates;
  }

  initTreasure() {
    this.sprite = PIXI.Sprite.fromImage('static/assets/Sprites/treasure.png');
    this.sprite.scale.x = 1.5 / this.gameBoard.dimension;
    this.sprite.scale.y = 1.5 / this.gameBoard.dimension;
    this.sprite.anchor.set(0.5);
    this.calculatePosition(this.coordinates);

    this.app.stage.addChild(this.sprite);
  }

  calculatePosition(coord) {
    let x = this.gameBoard.squareHighlighter.pointArray[coord[0]].x;
    let y = this.gameBoard.squareHighlighter.pointArray[
      this.gameBoard.dimension * coord[1]
    ].y;

    this.sprite.position.set(x, y);
    this.positionExact = [x, y];
  }

  calculateCoords(pos) {
    this.coordinates = util.indexToGridCoord(
      this.gameBoard.squareHighlighter.getGridIndex(pos)
    );
  }

  collectTreasure() {
    this.app.stage.removeChild(this.sprite);
  }
}
