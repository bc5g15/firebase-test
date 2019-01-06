/* 
  This class keeps track of the state of the players ship
  This class us used to rotate the ship and move it around the map.
*/

import * as PIXI from 'pixi.js';
import $ from 'jquery';
import { EventEmitter } from 'events';

export default class Ship extends EventEmitter {
  constructor(app, gameBoard, id, position, hitpoints, enemy) {
    super();

    this.app = app;
    this.gameBoard = gameBoard;
    this.id = id;
    this.hitpoints = hitpoints;

    // Whether we control it
    this.enemy = enemy;
    this.position = position; //coordinates

    this.sprite = null;
    this.isDestroyed = false; //Boolean that makes sure destroyed ships can't move
  }

  initShip() {
    this.sprite = PIXI.Sprite.fromImage(
      this.enemy
        ? 'static/assets/Sprites/enemyShip.png'
        : 'static/assets/Sprites/ship.png'
    );
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
    if (!this.isDestroyed && !(this.position[0] === 0)) {
      this.moveGeneral(-1, 0);
    } else {
      console.log('Cant move left!');
    }
  }

  moveRight() {
    if (
      !this.isDestroyed &&
      !(this.position[0] === this.gameBoard.dimension - 1)
    ) {
      this.moveGeneral(1, 0);
    } else {
      console.log('Cant move right!');
    }
  }

  moveUp() {
    if (!this.isDestroyed && !(this.position[1] === 0)) {
      this.moveGeneral(0, -1);
    } else {
      console.log('Cant move up!');
    }
  }

  moveDown() {
    if (
      !this.isDestroyed &&
      !(this.position[1] === this.gameBoard.dimension - 1)
    ) {
      this.moveGeneral(0, 1);
    } else {
      console.log('Cant move down!');
    }
  }

  // Moves the ship sprite
  moveGeneral(newX, newY) {
    if (this.isDestroyed) {
      return;
    }

    let x = this.position[0] + newX;
    let y = this.position[1] + newY;

    //create message using the jQuery
    let params = {
      id: this.id,
      x: x,
      y: y
    };

    $.post('/game/move', params);
    return true;

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

  destroy() {
    this.isDestroyed = true;
    this.emit('destroyed');
  }
}
