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
import { GLOBAL_HEIGHT, GLOBAL_WIDTH } from '../constants';
import * as util from './utility';

export default class SquareHighlighter {
  constructor(app, gameBoard) {
    this.app = app;
    this.gameBoard = gameBoard;

    this.pointArray = [];
    this.oldIndex = 0;

    this.position = null;

    //use these to calculate physics positioning of square
    this.squareX;
    this.squareY;

    //variables for the red and green square sprites.
    this.squareSprite;
    this.squareSpriteGreen;

    //important variable, stores the current closest square (represented by an index in the pointArray)
    this.indexClosest = 0;
  }

  //creates the red square texture and sprite
  createSquare() {
    this.sizeX = GLOBAL_WIDTH / this.gameBoard.dimension * 0.92;
    this.sizeY = GLOBAL_HEIGHT * 0.8 / this.gameBoard.dimension * 0.9;

    this.calcStartPos();

    let square = new PIXI.Graphics();
    square.beginFill(0xff0000, 0.4);
    square.drawRect(0, 0, this.sizeX, this.sizeY);
    square.endFill();
    this.square = square;

    let squareTexture = square.generateCanvasTexture();
    let squareSprite = new PIXI.Sprite(squareTexture);
    squareSprite.anchor.set(0.5);
    squareSprite.position.set(this.position[0], this.position[1]);
    this.squareSprite = squareSprite;

    this.app.stage.addChild(squareSprite);
  }

  //creates the green square texture and sprite
  createGreenSquare(x, y) {
    let squareGreen = new PIXI.Graphics();
    squareGreen.beginFill(0x00ff00, 0.3);
    squareGreen.drawRect(0, 0, this.sizeX, this.sizeY);
    squareGreen.endFill();

    let squareTextureGreen = squareGreen.generateCanvasTexture();
    let squareSpriteGreen = new PIXI.Sprite(squareTextureGreen);
    squareSpriteGreen.anchor.set(0.5);
    squareSpriteGreen.position.set(x, y);
    this.squareSpriteGreen = squareSpriteGreen;

    this.app.stage.addChild(squareSpriteGreen);
  }

  //calculates starting position for red square
  calcStartPos() {
    let index = Math.ceil(Math.pow(this.gameBoard.dimension, 2) / 2) - 1;
    let x = this.pointArray[index].x;
    let y = this.pointArray[index].y;

    //return a physical point and set it as the position.
    this.position = [x, y];
  }

  //moves red square to a specific grid square using the index of a point in the pointArray
  moveSquare(index) {
    this.position = [this.pointArray[index].x, this.pointArray[index].y];
    this.squareSprite.position.set(this.position[0], this.position[1]);
  }

  //moves green square to a specific grid square using the index of a point in the pointArray
  //as this square represents the current "target" square for missiles, it logs the target coordinate
  moveGreenSquare(index) {
    this.position = [this.pointArray[index].x, this.pointArray[index].y];
    this.squareSpriteGreen.position.set(this.position[0], this.position[1]);
    console.log(
      'Current Target: ' +
        util.indexToGridCoord(index, this.gameBoard.dimension)
    );
  }

  //calculates the square that the intex of the mouse is closest to. This is used to move the red
  //square across the grid.
  updateSquare(mousePosition) {
    let x = mousePosition.x;
    let y = mousePosition.y;

    let minDist = Number.MAX_SAFE_INTEGER;
    this.indexClosest = -1;

    if (!(y > GLOBAL_HEIGHT * 0.8 || x > GLOBAL_WIDTH)) {
      for (let i = 0; i < this.pointArray.length; i++) {
        let dist = Math.sqrt(
          Math.pow(x - this.pointArray[i].x, 2) +
            Math.pow(y - this.pointArray[i].y, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          this.indexClosest = i;
        }
      }
      this.moveSquare(this.indexClosest);
    }
  }

  //returns the physical position of the red square
  getPositionOfCurrentSquare() {
    let x = this.pointArray[this.indexClosest].x;
    let y = this.pointArray[this.indexClosest].y;
    return [x, y];
  }

  //returns the physical position of the green square
  getPositionOfGreenSquare() {
    let x = this.squareSpriteGreen.position.x;
    let y = this.squareSpriteGreen.position.y;
    return [x, y];
  }

  //returns the closest grid square (in the form of an index to be used with the pointArray[]) to the point argument
  //this function is probably best put in the utilities script file.
  getGridIndex(point) {
    let x = point[0];
    let y = point[1];

    let minDist = Number.MAX_SAFE_INTEGER;
    this.indexClosest = -1;

    for (let i = 0; i < this.pointArray.length; i++) {
      let dist = Math.sqrt(
        Math.pow(x - this.pointArray[i].x, 2) +
          Math.pow(y - this.pointArray[i].y, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        this.indexClosest = i;
      }
    }

    return this.indexClosest;
  }
}
