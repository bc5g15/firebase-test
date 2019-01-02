/*
This class is the entry point for the entire game and sets up the necessary pixi.js app boiler plate stuff
as well as the necessary classes and functions for the remainder of the game.
*/

import Game from './classes/game';
import Communicator from './classes/network';
import { testGameState } from './classes/test';

const DIMENSION = 9;

// Called via HTML and jinja
export function initGame(gameKey, me, token, channelId, initialMessage) {
  console.log('Insert the game creation code here!');
  let state = {
    gameKey: gameKey,
    me: me,
    started: false
  };

  new Communicator(state, me, token, channelId, initialMessage);
}

// Only run if we use webpack-dev-server
if (process.env.NODE_ENV !== 'production') {
  // Initializing variables to be used in the game
  let game = new Game(DIMENSION);
  game.gameState = testGameState();

  game.init();
}
