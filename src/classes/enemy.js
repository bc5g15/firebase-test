/*
Enemy class that adds enemies to the game, each with their own health, position, and ID (specific to this game only,
and coordinates to say which coordinates the ship is in for the current game state)
*/

import * as PIXI from 'pixi.js';
import $ from 'jquery';
import Ship from './ship';

const DESTROYED_TEXTURE = PIXI.Texture.fromImage(
  'static/assets/Sprites/shipDestroyed.png'
);

export default class Enemy {
  constructor(app, gameBoard, id, coordinates) {
    this.app = app;
    this.gameBoard = gameBoard;
    this.id = id;
    this.position = null; //coordinates
    this.sprite = null;
    this.health = 1000;
    this.hitpoints = 3;
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

  calculatePosition() {
    let x = this.gameBoard.gameGrid.getPointFromIndex(this.coordinates[0]).x;
    let y = this.gameBoard.gameGrid.getPointFromIndex(
      this.gameBoard.dimension * this.coordinates[1]
    ).y;

    this.sprite.position.set(x, y);
    this.position = [x, y];
  }
}

export function loadEnemies(app, gameBoard, debugEnemies) {
  //enemy has form of [id, [x, y]] where [x, y] is the index of the gameState array
  //enemy ships have constructor Enemy(app, id, position)
  // Object.values(gameBoard.ships).forEach(ship => {
  //   const iteratedshipindex = Object.values(gameBoard.ships).indexOf(ship);
  //   for (let otherShip in Object.values(gameBoard.ships)) {
  //     if (!(Object.values(gameBoard.ships).indexOf(otherShip) === iteratedshipindex)) {
  //       ship.enemyShips.push(otherShip); //For each player ship in the game, all of the other player ships
  //       //are added to the ship's enemyShips array to indicate how many enemies there are to destroy
  //     }
  //   }
  //   //enemy = new Enemy(app, ship[0], ship[1]);
  // });
  //I've kept the original enemy code here in case we want NPC enemies as well in which case we can incorporate
  // this in with the player ship code

  // Load custom state of enemies
  if (debugEnemies) {
    debugEnemies.forEach(ship => {
      let enemy = new Ship(app, gameBoard, ship[0], ship[1], 3, true);
      enemy.initShip();
      gameBoard.ships[ship[0]] = enemy;
    });
  }
}

// Check for existence of ship at coordinate and remove hitpoints
export function checkEnemyHit(gameBoard, coord) {
  Object.values(gameBoard.ships).forEach(ship => {
    if (
      ship.position[0] === coord[0] &&
      ship.position[1] === coord[1] &&
      ship.hitpoints > 0 &&
      ship.enemy
    ) {
      console.log('Target Hit!');
      console.log(ship.hitpoints);
      if (ship.hitpoints === 1) {
        console.log('Abandon ship!');
        ship.hitpoints = 0;
        ship.sprite.texture = DESTROYED_TEXTURE;
        ship.sprite.alpha = 0.65;
        ship.destroy();
      } else {
        ship.hitpoints = ship.hitpoints - 1;
      }
      let param = {
        id: ship.id
      };
      $.post('/game/hit', param);
    }
  });
}

// Destroys the ship and slowly makes it "sink into the waves"
// once the ship is invisible, the ship sprite is removed.
export function updateDestroyedShips(gameBoard) {
  Object.values(gameBoard.ships).forEach(ship => {
    if (ship.isDestroyed) {
      ship.sprite.alpha -= 0.005;

      if (ship.sprite.alpha < 0) {
        gameBoard.app.stage.removeChild(ship.sprite);
      }
    }
  });
}
