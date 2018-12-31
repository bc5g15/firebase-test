/**
This keeps track of all the enemies, both active and destroyed for the current game. For the final game
the arrays will be sent with each update from the server.
*/

import * as PIXI from 'pixi.js';
import Enemy from './enemy';

let destroyedTexture = PIXI.Texture.fromImage(
  'static/assets/Sprites/shipDestroyed.png'
);

export function loadEnemies(app, gameBoard) {
  //enemy has form of [id, [x, y]] where [x, y] is the index of the gameState array
  //enemy ships have constructor Enemy(app, id, position)
  gameBoard.gameState.forEach(ship => {
    let enemy = new Enemy(app, gameBoard, ship[0], ship[1]);
    gameBoard.enemyShips.push(enemy);
  });

  //initialises an enemy class for each enemy.
  gameBoard.enemyShips.forEach(enemy => {
    enemy.initEnemy();
  });
}

//if there exists an enemy ship at the provided coordinates, the enemy is destroyed.
export function checkEnemyHit(gameBoard, coord) {
  // This currently is quite buggy for some reason, ie not detecting hits and not fully removing sprites
  // Un-comment block to test hit detection.
  gameBoard.enemyShips.forEach(enemy => {
    if (
      enemy.coordinates[0] === coord[0] &&
      enemy.coordinates[1] === coord[1]
    ) {
      console.log('Target Hit!');
      enemy.sprite.texture = destroyedTexture;
      enemy.sprite.alpha = 0.65;
      gameBoard.destroyedShips.push(enemy);
      gameBoard.enemyShips.splice(gameBoard.enemyShips.indexOf(enemy), 1);
    }
  });
  console.log('Length of destroyed ships: ' + gameBoard.destroyedShips.length);
}

//destroys the ship and slowly makes it "sink into the waves"
//once the ship is invisible, the ship sprite is removed.
export function updateDestroyedShips(gameBoard) {
  gameBoard.destroyedShips.forEach(enemy => {
    //console.log(enemy);
    enemy.sprite.alpha -= 0.005;

    if (enemy.sprite.alpha < 0) {
      gameBoard.app.stage.removeChild(enemy.sprite);
    }
  });
}

//FIX BUG WITH DESTROYING ENEMIES AND THEIR FADING
