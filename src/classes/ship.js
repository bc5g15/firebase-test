/* 
  This class keeps track of the state of the players ship
  This class us used to rotate the ship and move it around the map.
*/

import * as PIXI from 'pixi.js';
import $ from 'jquery';
import { EventEmitter } from 'events';
import * as util from './utility';

const DESTROYED_TEXTURE = PIXI.Texture.fromImage(
  'static/assets/Sprites/shipDestroyed.png'
);
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
    this.movementEnabled = true;
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

    // Call with init argument set to true, disables initial rotation
    this.updatePositionFromCoords(this.position, true);

    this.app.stage.addChild(this.sprite);
  }

  // Sets the position of the sprite according to 2D coordinates
  updatePositionFromCoords(pos, init) {
    let x = this.gameBoard.gameGrid.getPointFromIndex(pos[0]).x;
    let y = this.gameBoard.gameGrid.getPointFromIndex(
      this.gameBoard.dimension * pos[1]
    ).y;

    // Rotate ship
    if (!init) {
      this.sprite.rotation =
        util.rotateTo(x, y, this.sprite.position.x, this.sprite.position.y) +
        Math.PI / 2;
    }
    this.sprite.position.set(x, y);
  }

  moveLeft() {
    if (
      !this.isDestroyed &&
      this.movementEnabled &&
      !(this.position[0] === 0)
    ) {
      this.moveGeneral(-1, 0);
    } else {
      console.log('Cant move left!');
    }
  }

  moveRight() {
    if (
      !this.isDestroyed &&
      this.movementEnabled &&
      !(this.position[0] === this.gameBoard.dimension - 1)
    ) {
      this.moveGeneral(1, 0);
    } else {
      console.log('Cant move right!');
    }
  }

  moveUp() {
    if (
      !this.isDestroyed &&
      this.movementEnabled &&
      !(this.position[1] === 0)
    ) {
      this.moveGeneral(0, -1);
    } else {
      console.log('Cant move up!');
    }
  }

  moveDown() {
    if (
      !this.isDestroyed &&
      this.movementEnabled &&
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

    this.movementEnabled = false;

    let x = this.position[0] + newX;
    let y = this.position[1] + newY;

    //create message using the jQuery
    let params = {
      id: this.id,
      x: x,
      y: y
    };

    $.post('/game/move', params);

    this.setPosition(x, y, true);

    return true;
  }

  /*
  A new method that sets the position of a ship on the grid
   */
  setPosition(newX, newY, noUnlock) {
    console.log('Message in');
    console.log(newX);
    console.log(newY);

    this.movementEnabled = !noUnlock;

    this.updatePositionFromCoords([newX, newY], !noUnlock);

    this.position[0] = newX;
    this.position[1] = newY;
  }

  destroy() {
    this.isDestroyed = true;
    this.hitpoints = 0;
    this.sprite.texture = DESTROYED_TEXTURE;
    this.sprite.alpha = 0.65;
    this.emit('destroyed');
  }
}
