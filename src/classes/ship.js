/* 
This class keeps track of the state of the players ship (SPECIFICALLY NOT USED FOR ENEMY SHIPS)
This class us used to rotate the ship and move it around the map.
*/

import * as PIXI from 'pixi.js';
import $ from 'jquery';

export default class Ship {
  constructor(app, gameBoard, id, position, hitpoints) {
    this.app = app;
    this.gameBoard = gameBoard;
    this.id = id;

    this.position = position; //coordinates
    //this.hitpoints = hitpoints; Don't really need this now that backend hitpoints have been engineered

    this.sprite = null;
    this.isDestroyed = false; //Boolean that makes sure destroyed ships can't move
  }

  initShip() {
    this.sprite = PIXI.Sprite.fromImage('static/assets/Sprites/ship.png');
    this.sprite.scale.x = 1.5 / this.gameBoard.dimension;
    this.sprite.scale.y = 1.5 / this.gameBoard.dimension;
    this.sprite.anchor.set(0.5);

    this.updatePositionFromCoords(this.position);

    this.app.stage.addChild(this.sprite);
  }

  // Sets the position of the sprite according to 2D coordinates
  updatePositionFromCoords(pos) {
    let x = this.gameBoard.gameGrid.getPointFromIndex(pos[0]).x;
    let y = this.gameBoard.gameGrid.getPointFromIndex(
      this.gameBoard.dimension * pos[1]
    ).y;

    this.sprite.position.set(x, y);
  }

  moveLeft() {
    if (this.isDestroyed == false && !(this.position[0] === 0)) {
      this.moveGeneral(-1, 0);
    } else {
      console.log('Cant move left!');
    }
  }

  moveRight() {
    if (
      this.isDestroyed == false &&
      !(this.position[0] === this.gameBoard.dimension - 1)
    ) {
      this.moveGeneral(1, 0);
    } else {
      console.log('Cant move right!');
    }
  }

  moveUp() {
    if (this.isDestroyed == false && !(this.position[1] === 0)) {
      this.moveGeneral(0, -1);
    } else {
      console.log('Cant move up!');
    }
  }

  moveDown() {
    if (
      this.isDestroyed == false &&
      !(this.position[1] === this.gameBoard.dimension - 1)
    ) {
      this.moveGeneral(0, 1);
    } else {
      console.log('Cant move down!');
    }
  }

  // Moves the ship sprite
  moveGeneral(newX, newY) {
    let x = this.position[0] + newX;
    let y = this.position[1] + newY;

    //create message using the jQuery
    let params = {
      id: this.id,
      x: x,
      y: y
    };

    $.post('/game/move', params);

    // this.calculatePosition([x, y]);
    //
    // this.position[0] = x;
    // this.position[1] = y;
    //
    // console.log("New Position: " + this.position + ", Score: " + score);
  }

  /*
  A new method that sets the position of a ship on the grid
   */
  setPosition(newX, newY) {
    console.log('Message in');
    console.log(newX);
    console.log(newY);

    this.updatePositionFromCoords([newX, newY]);

    this.position[0] = newX;
    this.position[1] = newY;
  }
}
