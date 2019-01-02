/*
This class is the entry point for the entire game and sets up the necessary pixi.js app boiler plate stuff
as well as the necessary classes and functions for the remainder of the game.
*/

import * as PIXI from 'pixi.js';
import $ from 'jquery';
import * as firebase from 'firebase';

import { testGameState } from './classes/test';
import Ship from './classes/ship';
import Game from './classes/game';

// initialise firebase
let config = {
  apiKey: 'AIzaSyABYPdWIF56Ff7HbPQ-nJfE9YY0Fcc_eeQ',
  authDomain: 'fir-test-222916.firebaseapp.com',
  databaseURL: 'https://fir-test-222916.firebaseio.com',
  projectId: 'firebase-test-222916',
  storageBucket: 'firebase-test-222916.appspot.com',
  messagingSenderId: '368557792160'
};
firebase.initializeApp(config);

const DIMENSION = 9;

//initializing variables to be used in the game
let game = new Game(DIMENSION);
game.gameState = testGameState();

game.init();

function updateFullGameState(newState) {
  let tiles = newState.tiles;
  console.log(tiles);
  for (let x = 0; x < tiles.length; x++) {
    let tile = tiles[x];
    console.log(tile);
    if (!(tile.type in game.ships)) {
      game.ships[tile.type] = new Ship(app, tile.type, game, [
        tile.col,
        tile.row
      ]);
      game.ships[tile.type].initShip();
      if (tile.type === state.me) {
        console.log('Resetting myself');
        myShip = game.ships[tile.type];
        game.squareHighlighter._createTargetSquare(
          myShip.sprite.position.x,
          myShip.sprite.position.y
        );
      }
    }
  }
}

function updateSingleShip(newState) {
  let newShip = new Ship(app, newState.type, game, [
    newState.col,
    newState.row
  ]);
  game.ships[newState.type] = newShip;
  newShip.initShip();
  if (newState.type === state.me) {
    console.log('Resetting myself');
    myShip = newShip;
    game.squareHighlighter._createTargetSquare(
      myShip.sprite.position.x,
      myShip.sprite.position.y
    );
  }
}

function moveShip(newState) {
  game.ships[newState.type].setPosition(newState.col, newState.row);
}

function resolveHit(newState) {
  //Explosion
}

function destroyShip(newState) {
  //Explosion
  ships[newState.type].sprite = PIXI.Sprite.fromImage(
    'static/assets/Sprites/shipDestroyed.png'
  ); //Changes the ship's
  // image to represent it being destroyed
  ships[newState.type].isDestroyed = true;
}

function initGame(gameKey, me, token, channelId, initialMessage) {
  console.log('Insert the game creation code here!');
  state = {
    gameKey: gameKey,
    me: me,
    started: false
  };

  myId = me;

  let channel = null;

  let handlers = {};

  function onMessage(newState) {
    console.log('New Message');
    console.log(newState.token);

    if (newState.token in handlers) {
      handlers[newState.token](newState);
    } else {
      console.log('Unrecognised token: ' + newState.token);
    }
    return;

    // if (newState.token === "open")
    // {
    //     if(!state.started) {
    //         $.post("/game/join");
    //         state.started = true;
    //     }
    // }
    // else if(newState.token === "position") {
    //     /*
    //     Returns my own position if I rejoin the game
    //     Some of this is repeated. Should extract the new
    //     user conditionals
    //      */
    //     updateFullGameState(newState);
    //     // let tiles = newState.tiles;
    //     // console.log(tiles);
    //     // for(let x=0; x<tiles.length; x++) {
    //     //     let tile = tiles[x];
    //     //     console.log(tile);
    //     //     ships[tile.type] = new NewShip(app, tile.type, [tile.col, tile.row]);
    //     //     // myShip = new NewShip(app, newState.type, [newState.col, newState.row]);
    //     //     // ships[newState.type] = myShip;
    //     //     ships[tile.type].initShip();
    //     //     if(tile.type === state.me) {
    //     //         myShip = ships[tile.type];
    //     //         createGreenSquare(myShip.sprite.position.x, myShip.sprite.position.y);
    //     //     }
    //     // }
    // }
    // else if(newState.token === "new_user") {
    //     console.log("New Ship");
    //     // Declare shipbuilding code in the listener
    //     // updateFullGameState(newState);
    //     updateSingleShip(newState);
    //
    //
    // }
    // else if(newState.token === "move")
    // {
    //     console.log("Got Move Response");
    //     // console.log(newState);
    //     // console.log(newState.tiles);
    //     // console.log(newState.tiles[0]);
    //     // updateSingleShip(newState);
    //     moveShip(newState);
    //     // for(let x=0; x<newState.tiles.length; x++)
    //     // {
    //     //     let tile = newState.tiles[x];
    //     //     ships[tile.type].setPosition(tile.col, tile.row);
    //     // }
    //
    //     // let tile = newState.tiles[0];
    //     // console.log(tile.row);
    //     // console.log(tile.col);
    //
    //     // myShip.setPosition(tile.col, tile.row)
    //
    // }
  }

  function onOpened() {
    console.log('Opening Game');
    console.log('Who am I?');
    console.log(state.me);
    handlers['open'] = newState => {
      if (!state.started) {
        state.started = true;

        //Add the new handlers
        handlers['move'] = moveShip;
        handlers['new_user'] = updateSingleShip;
        handlers['position'] = updateFullGameState;
        $.post('/game/join');
      }
    };
    init();
    $.post('/game/open');
  }

  function openChannel() {
    // [START auth_login]
    // sign into Firebase with the token passed from the server
    firebase
      .auth()
      .signInWithCustomToken(token)
      .catch(function(error) {
        console.log('Login Failed: ', error.code);
        console.log('Error message: ', error.message);
      });
    // [END auth_login]
    console.log('Logged in');
    // [START add_listener]
    channel = firebase.database().ref('channels/' + channelId);
    // add a listener to the path that fires any time the
    // value of the data changes
    channel.on('value', function(data) {
      // console.log("Something happened!");
      // console.log(data.val());
      onMessage(data.val());
    });
    // [END add_listener]
    onOpened();
  }

  function initialize() {
    // Always include the gamekey in our requests
    $.ajaxPrefilter(function(opts) {
      if (opts.url.indexOf('?') > 0) opts.url += '&g=' + state.gameKey;
      else opts.url += '?g=' + state.gameKey;
    });

    openChannel();

    onMessage(initialMessage);
  }

  setTimeout(initialize, 100);
}

//initializes the game
// init();

/*
This init function starts by setting some stuff for pixi.js, boilerplate stuff
and adding the game to the document. It loads sounds and caches missile assets
and initializes the keyboard listeners, grid , ocean, lower console, ship, enemies
and a few other things. Lastly, the app.ticker adds specific functions into pixi's
inbuilt ticker. This is set to 60fps. The gameLoop() function is added to the ticker
so that the gameLoop function is run 60 times per second.
*/
