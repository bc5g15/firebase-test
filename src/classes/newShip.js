/* 
This class keeps track of the state of the players ship (SPECIFICALLY NOT USED FOR ENEMY SHIPS)
This class us used to rotate the ship and move it around the map.
*/
import * as PIXI from 'pixi.js';
import $ from 'jquery';

export default class NewShip {
  constructor(app, id, gameBoard, position, hitpoints) {
    this.app = app;
    this.id = id;
    this.gameBoard = gameBoard;
    this.position = position; //coordinates
    this.hitpoints = hitpoints;
    this.positionExact = null; //exact coordinates
    this.sprite = null;
    this.isDestroyed = null; //Boolean that makes sure destroyed ships can't move
    this.enemyShips = []; //Gives each ship a list of all the other ships in the game, which are its enemies.
    // Whenever a player ship is destroyed, all other ships remove it from their enemyShips list. When the
    // enemyShips array of a particular ship is emptied, i.e. all other ships are destroyed, the game end sequence
    // will be triggered.
  }

  initShip() {
    this.sprite = PIXI.Sprite.fromImage('static/assets/Sprites/ship.png');
    this.sprite.scale.x = 1.5 / this.gameBoard.dimension;
    this.sprite.scale.y = 1.5 / this.gameBoard.dimension;
    this.sprite.anchor.set(0.5);
    this.calculatePosition(this.position);
    this.isDestroyed = false;

    this.app.stage.addChild(this.sprite);
  }

  calculatePosition(pos) {
    console.log(pos);
    let x = this.gameBoard.squareHighlighter.pointArray[pos[0]].x;
    let y = this.gameBoard.squareHighlighter.pointArray[
      this.gameBoard.dimension * pos[1]
    ].y;

    this.sprite.position.set(x, y);
    this.positionExact = [x, y];
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

    this.calculatePosition([newX, newY]);

    this.position[0] = newX;
    this.position[1] = newY;
  }
}
