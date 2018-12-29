/*
Enemy class that adds enemies to the game, each with their own health, position, and ID (specific to this game only,
and coordinates to say which coordinates the ship is in for the current game state)
*/

import * as PIXI from 'pixi.js';

export default class Enemy {
  constructor(app, gameBoard, id, coordinates) {
    this.app = app;
    this.gameBoard = gameBoard;
    this.id = id;
    this.position = null; //coordinates
    this.sprite = null;
    this.health = 1000;
    this.coordinates = coordinates;
  }

  initEnemy() {
    this.sprite = PIXI.Sprite.fromImage('static/assets/Sprites/ship.png');
    this.sprite.scale.x = 1.5 / this.gameBoard.dimension;
    this.sprite.scale.y = 1.5 / this.gameBoard.dimension;

    this.sprite.anchor.set(0.5);
    this.sprite.rotation = Math.PI * 2 * Math.random();
    this.calculatePosition();

    this.app.stage.addChild(this.sprite);
    console.log('Enemy Coordinate: ' + this.coordinates);
  }

  calculatePosition(pos) {
    let x = this.gameBoard.squareHighlighter.pointArray[this.coordinates[0]].x;
    let y = this.gameBoard.squareHighlighter.pointArray[
      this.gameBoard.dimension * this.coordinates[1]
    ].y;

    this.sprite.position.set(x, y);
    this.position = [x, y];
  }
}
