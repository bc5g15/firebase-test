/*
This is an example piece of code from online! All credit for this code goes to https://github.com/kittykatattack/learningPixi#keyboard
If this is a problem it can be re-written!!!
If not, we can put it in a library to reduce our LoC.
*/

//the keyboard abstracts the key event handling away from the rest of the code
//the keyboard init method determines what functions are called when either of
//the arrow keys are pressed. Currently they are used for moving the ship around
//the grid.

import { GLOBAL_HEIGHT } from '../constants';
import * as util from './utility';

function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener('keydown', downListener, false);
  window.addEventListener('keyup', upListener, false);

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener);
    window.removeEventListener('keyup', upListener);
  };

  return key;
}

export default function keyboardInit(app, mousePosition, gameBoard) {
  //Changed to take myShip as a parameter
  let left = keyboard('ArrowLeft'),
    up = keyboard('ArrowUp'),
    right = keyboard('ArrowRight'),
    down = keyboard('ArrowDown');

  left.press = () => {
    if (util.canAfford(gameBoard)) {
      gameBoard.myShip.moveLeft();
    } else {
      console.log('Cannot afford to move');
    }
  };

  right.press = () => {
    if (util.canAfford(gameBoard)) {
      gameBoard.myShip.moveRight();
    } else {
      console.log('Cannot afford to move');
    }
  };

  up.press = () => {
    if (util.canAfford(gameBoard)) {
      gameBoard.myShip.moveUp();
    } else {
      console.log('Cannot afford to move');
    }
  };

  down.press = () => {
    if (util.canAfford(gameBoard)) {
      gameBoard.myShip.moveDown();
    } else {
      console.log('Cannot afford to move');
    }
  };

  //this function sets the location of the green square when the mouse is clicked
  app.stage.on('mousedown', () => {
    if (!(mousePosition.y > GLOBAL_HEIGHT * 0.8)) {
      gameBoard.squareHighlighter.positionTarget(
        gameBoard.squareHighlighter.hoverIndex
      );
      //console.log("pos: " + pos);
      //console.log("GETGRIDINDEX(pos): " + getGridIndex(pos));
    }
  });
}
