/*
A short statement regarding how the game calculates physical positions and coordinates.
The points array in this class is used globally. This array simply stores the physical 
coordinate eg (x = 123.333, y = 656.888) for the centre of each grid square. These 
physical coordinate values are used to position sprites, determine targets for missiles 
etc. However as passing exact points around is messy, the game predominantly positions 
enemies, ships and missile targets based on the INDEX OF A SPECIFIC POINT. For example, 
a grid of 9 * 9 has 81 squares, so the index of the last square is 80. Regarding this, a
ship is positioned at a specific index, and then renders the sprite in the location based
upon the values at that index in the point array. Eg pointArray[80].x and pointArray[80].y 
gives the physical x and y coordinates to render a ship sprite. In other cases it is useful
to know the equivalent coordinate value of the index or position. In short, the game uses the
index of targets to make the game more manageable.
*/

import * as PIXI from 'pixi.js';
import { GLOBAL_WIDTH } from '../constants';

export default class SquareHighlighter {
  constructor(app, gameGrid) {
    this.app = app;
    this.gameGrid = gameGrid;

    // Variables for the hover and target sprites
    let squareSize = GLOBAL_WIDTH / this.gameGrid.dimension * 0.92;
    this._createHoverSquare(squareSize);
    this._createTargetSquare(squareSize);
  }

  _createSquareSprite(color, alpha, size) {
    let square = new PIXI.Graphics();
    square.beginFill(color, alpha);
    square.drawRect(0, 0, size, size);
    square.endFill();

    let squareSprite = new PIXI.Sprite(square.generateCanvasTexture());
    squareSprite.anchor.set(0.5);

    return squareSprite;
  }

  // Creates the hover square sprite and returns it
  _createHoverSquare(size) {
    let index = Math.ceil(Math.pow(this.gameGrid.dimension, 2) / 2) - 1;
    let pos = this.gameGrid.getPointFromIndex(index);

    let hoverSprite = this._createSquareSprite(0xff0000, 0.4, size);
    hoverSprite.position.set(pos.x, pos.y);
    this.hoverSquare = hoverSprite;

    this.app.stage.addChild(hoverSprite);
  }

  // Creates the target square sprite
  _createTargetSquare(size) {
    let targetSprite = this._createSquareSprite(0x00ff00, 0.3, size);
    this.targetSquare = targetSprite;

    this.app.stage.addChild(targetSprite);
  }

  // Position a given square on a given index
  _positionSquare(sprite, index) {
    let pos = this.gameGrid.getPointFromIndex(index);
    sprite.position.set(pos.x, pos.y);
  }

  // Position target square
  positionTarget(index) {
    this._positionSquare(this.targetSquare, index);
    this.targetIndex = index;
  }

  // Position hover square
  positionHover(index) {
    this._positionSquare(this.hoverSquare, index);
    this.hoverIndex = index;
  }

  // Calculates the square that the index of the mouse is closest to. This is used to move the hover
  // square across the grid.
  updateSquare(mousePosition) {
    let x = mousePosition.x;
    let y = mousePosition.y;
    // Move square to grid closest to mouse position
    this.positionHover(this.gameGrid.getIndexFromPoint([x, y]));
  }

  // Returns the physical position of the hover square
  getPositionOfHoverSquare() {
    return [this.hoverSquare.position.x, this.hoverSquare.position.y];
  }

  // Returns the physical position of the target square
  getPositionOfTargetSquare() {
    return [this.targetSquare.position.x, this.targetSquare.position.y];
  }
}
