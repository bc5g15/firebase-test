/* 
This class keeps track of the state of the players ship (SPECIFICALLY NOT USED FOR ENEMY SHIPS)
This class us used to rotate the ship and move it around the map.
*/
import * as PIXI from 'pixi.js';
import * as treasureTracker from './treasureTracker';

export default class Ship {
  constructor(app, gameBoard, position) {
    this.app = app;
    this.gameBoard = gameBoard;
    this.position = position; //coordinates
    this.positionExact = null; //exact coordinates
    this.sprite = null;
  }

  initShip() {
    this.sprite = PIXI.Sprite.fromImage('static/assets/Sprites/ship.png');
    this.sprite.scale.x = 1.5 / this.gameBoard.dimension;
    this.sprite.scale.y = 1.5 / this.gameBoard.dimension;
    this.sprite.anchor.set(0.5);
    this.calculatePosition(this.position);
  }

  render() {
    this.app.stage.addChild(this.sprite);
  }

  calculatePosition(pos) {
    let x = this.gameBoard.squareHighlighter.pointArray[pos[0]].x;
    let y = this.gameBoard.squareHighlighter.pointArray[
      this.gameBoard.dimension * pos[1]
    ].y;

    this.sprite.position.set(x, y);
    this.positionExact = [x, y];
  }

  moveLeft() {
    if (!(this.position[0] === 0)) {
      this.moveGeneral(-1, 0);
    } else {
      console.log('Cant move left!');
    }
  }

  moveRight() {
    if (!(this.position[0] === this.gameBoard.dimension - 1)) {
      this.moveGeneral(1, 0);
    } else {
      console.log('Cant move right!');
    }
  }

  moveUp() {
    if (!(this.position[1] === 0)) {
      this.moveGeneral(0, -1);
    } else {
      console.log('Cant move up!');
    }
  }

  moveDown() {
    if (!(this.position[1] === this.gameBoard.dimension - 1)) {
      this.moveGeneral(0, 1);
    } else {
      console.log('Cant move down!');
    }
  }

  moveGeneral(newX, newY) {
    let x = this.position[0] + newX;
    let y = this.position[1] + newY;

    this.calculatePosition([x, y]);

    this.position[0] = x;
    this.position[1] = y;

    treasureTracker.checkCollectedTreasure(this.gameBoard, this.position);
    //console.log("New Position: " + this.position + ", Score: " + score);
  }

  /*
    A new method that sets the position of a ship on the grid
  */
  setPosition(newX, newY) {
    this.calculatePosition([newX, newY]);

    this.position[0] = newX;
    this.position[1] = newY;
  }
}
