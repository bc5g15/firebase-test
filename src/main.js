/*
This class is the entry point for the entire game and sets up the necessary pixi.js app boiler plate stuff
as well as the necessary classes and functions for the remainder of the game.
*/

import * as PIXI from 'pixi.js';
import $ from 'jquery';
import * as firebase from 'firebase';

import * as util from './classes/utility';
import { GLOBAL_HEIGHT, GLOBAL_WIDTH } from './constants';
import { testGameState } from './classes/test';
import GridDrawer from './classes/grid';
import Ocean from './classes/ocean';
import Ship from './classes/ship';
import NewShip from './classes/newShip';
// import FogOfWar from "./classes/fogOfWar";
import Sound, { setLaunchSound, setExplodeSound } from './classes/sound';
import * as lowerConsole from './classes/lowerConsole';
import * as missileControl from './classes/missileController';
import * as treasureTracker from './classes/treasureTracker';
import * as enemyTracker from './classes/enemyTracker';
import GameState from './classes/gameBoard';
import keyboardInit from './classes/keyboard';

const loader = PIXI.loader;

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

//initialize new pixi application
const app = new PIXI.Application({
  width: GLOBAL_HEIGHT, // default: 800
  height: GLOBAL_WIDTH, // default: 600
  antialias: true, // default: false
  transparent: false, // default: false
  resolution: 1, // default: 1
  backgroundColor: 0x000000
});

const dimension = 9;

let mousePosition = app.renderer.plugins.interaction.mouse.global;

//initializing variables to be used in the game
let gameBoard = new GameState(app, dimension, mousePosition);
gameBoard.gameState = testGameState();

let myShip;
let testTreasureLocations = [[1, 1], [2, 2], [3, 3], [4, 4]];

//var start;  //timing stuff, check the missile controller

//initialize grid class to draw grid
let grid = new GridDrawer(app, gameBoard, 2);

//initializes ocean and fog of war classes
let ocean;
// let fog;

let state = {};
let myId;

function updateFullGameState(newState) {
  let tiles = newState.tiles;
  console.log(tiles);
  for (let x = 0; x < tiles.length; x++) {
    let tile = tiles[x];
    console.log(tile);
    if (!(tile.type in gameBoard.ships)) {
      gameBoard.ships[tile.type] = new NewShip(app, tile.type, gameBoard, [
        tile.col,
        tile.row
      ]);
      gameBoard.ships[tile.type].initShip();
      if (tile.type === state.me) {
        console.log('Resetting myself');
        myShip = gameBoard.ships[tile.type];
        gameBoard.squareHighlighter.createGreenSquare(
          myShip.sprite.position.x,
          myShip.sprite.position.y
        );
      }
    }
  }
}

function updateSingleShip(newState) {
  let newShip = new NewShip(app, newState.type, gameBoard, [
    newState.col,
    newState.row
  ]);
  gameBoard.ships[newState.type] = newShip;
  newShip.initShip();
  if (newState.type === state.me) {
    console.log('Resetting myself');
    myShip = newShip;
    gameBoard.squareHighlighter.createGreenSquare(
      myShip.sprite.position.x,
      myShip.sprite.position.y
    );
  }
}

function moveShip(newState) {
  gameBoard.ships[newState.type].setPosition(newState.col, newState.row);
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
init();

/*
This init function starts by setting some stuff for pixi.js, boilerplate stuff
and adding the game to the document. It loads sounds and caches missile assets
and initializes the keyboard listeners, grid , ocean, lower console, ship, enemies
and a few other things. Lastly, the app.ticker adds specific functions into pixi's
inbuilt ticker. This is set to 60fps. The gameLoop() function is added to the ticker
so that the gameLoop function is run 60 times per second.
*/

//main game loop
function gameLoop(delta) {
  ocean.update(delta);
  missileControl.updateMissiles(gameBoard);
  gameBoard.squareHighlighter.updateSquare(mousePosition);
  enemyTracker.updateDestroyedShips(gameBoard);
}

function init() {
  //setting up the view to render to
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.display = 'block';
  app.renderer.autoResize = true;
  //app.renderer.resize(window.innerWidth, window.innerHeight);
  app.stage.interactive = true;
  document.body.appendChild(app.view);

  let sizeGridSquareX = GLOBAL_WIDTH / dimension;
  let sizeGridSquareY = GLOBAL_HEIGHT * 0.8 / dimension;

  //caching sprite and loading sounds
  loader.add('missileSprite', 'static/assets/Sprites/missile.png');
  setExplodeSound(new Sound('static/assets/Sounds/explode.mp3'));
  setLaunchSound(new Sound('static/assets/Sounds/launch.mp3'));

  //visuals
  ocean = new Ocean(app);
  ocean.init();

  ///dealing with grids and squares;
  grid = new GridDrawer(app, dimension, 2);
  grid.calculatePoints();

  //creates ship
  myShip = new Ship(app, gameBoard, [0, 0]);
  myShip.initShip();

  // initialise keyboard input
  keyboardInit(app, mousePosition, gameBoard, myShip);

  //loads enemy ships from game state data
  enemyTracker.loadEnemies();

  // initialises button and other data to display
  lowerConsole.initLowerConsole(app);

  //create fog of
  //fog = new FogOfWar(app);
  //fog.init();
  //fogMask = fog.fogMask;

  //renders the grid lines and the circles on top of the fog
  grid.drawGrid();
  grid.drawCircles();
  myShip.render();

  //load treasure based on array of coordinates;
  treasureTracker.loadTreasure(gameBoard, testTreasureLocations);

  //create squares
  gameBoard.squareHighlighter.createSquare(dimension);

  //create green square to start around the ship
  gameBoard.squareHighlighter.createGreenSquare(
    myShip.sprite.position.x,
    myShip.sprite.position.y
  );

  //calculate missile speed in utility function
  gameBoard.missileSpeed = util.calculateMissileSpeed(
    gameBoard.missileSpeedFactor,
    gameBoard,
    sizeGridSquareX,
    sizeGridSquareY
  );

  //adds gameLoop function to update with the PIXI.js ticker (set to 60 fps)
  app.ticker.add(delta => gameLoop(delta));
}
