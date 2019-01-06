/*
The missile controller is used to maintain a store and track all the missiles the user has fired
This is where the shoot function is called when the fire button is pressed. Each missile has a sprite
to render the missile. It also contains the target which is the physical x and y coordinates for the
green square (remember the green square represents the current target location). The missile object 
stores a targetCoord variable which is the coordinates of the target (ie [3,6] for example. This is 
mainly used for console logging and displaying data to the user). The target variable is an array of
the physical x and y coordinates that the missile is attempting to hit. Every frame, the updateMissile() 
function is called by the game loop. This updates the position of the missile. Each missile checks if 
it has hit its target. It calculates the distance of the missile to the current target using the 
physical x and y coordinates. If the distance is less than 20px, the missile has hit its target square
and is destroyed by calling the destroyMissile() function. Upon destruction, checks to see if an enemy
exist in the square it is destroyed in. The function checkEnemyHit() which is in the enemy tracker is 
called passing the target coordinates as an argument. 
*/

import * as PIXI from 'pixi.js';
import * as util from './utility';
import * as enemy from './enemy';
import { playLaunchSound, playExplodeSound } from './sound';
import Explosion from './explosion';

// Creates missile and stores it in the array of missiles.
export function shoot(rotation, startPosition, gameBoard) {
  let target = gameBoard.squareHighlighter.targetSquare.position;

  let missile = {
    sprite: new PIXI.Sprite.fromImage('static/assets/Sprites/missile.png'),
    targetCoord: util.indexToGridCoord(
      gameBoard.squareHighlighter.targetIndex,
      gameBoard.dimension
    ),
    target: [target.x, target.y]
  };
  console.log('Missile Coord: ' + missile.targetCoord);

  missile.sprite.position.x = startPosition.x;
  missile.sprite.position.y = startPosition.y;
  missile.sprite.rotation = rotation;
  missile.sprite.scale.x = 0.75;
  missile.sprite.scale.y = 0.75;
  missile.sprite.anchor.set(0.5);

  // Add to app
  gameBoard.app.stage.addChild(missile.sprite);

  // Add to tick function
  gameBoard.missiles.push(missile);

  // Play sound
  playLaunchSound();
  return true;
}

// Runs every tick, updates missile positions and checks for hits
export function updateMissiles(gameBoard) {
  for (let len = gameBoard.missiles.length - 1; len >= 0; --len) {
    console.log('update');
    let m = gameBoard.missiles[len].sprite;
    m.position.x += Math.cos(m.rotation) * gameBoard.missileSpeed;
    m.position.y += Math.sin(m.rotation) * gameBoard.missileSpeed;
  }

  checkForHit(gameBoard);
}

// Checks for hits by calculating the physical distance to target. threshold variable is used
// to determine the distance required to determine a hit
function checkForHit(gameBoard) {
  let threshold = 20;

  for (let m = 0; m < gameBoard.missiles.length; m++) {
    let target = gameBoard.missiles[m].target;
    let position = gameBoard.missiles[m].sprite.position;

    let distToTarget = util.calculateDistance(
      [target[0], target[1]],
      [position.x, position.y]
    );

    // Destroy if we're close enough
    if (distToTarget < threshold) {
      destroyMissile(gameBoard, m);
    }
  }
}

//checks if an enemy exists at destruction location. Removes missile from missile array and stage
function destroyMissile(gameBoard, missile) {
  console.log('TargetCoord: ' + gameBoard.missiles[missile].targetCoord);

  enemy.checkEnemyHit(gameBoard, gameBoard.missiles[missile].targetCoord);

  new Explosion(gameBoard.app, gameBoard.missiles[missile].target);
  playExplodeSound();

  gameBoard.app.stage.removeChild(gameBoard.missiles[missile].sprite);
  gameBoard.missiles.splice(missile, 1);
}
