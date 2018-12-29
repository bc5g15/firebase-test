/*
This class is the entry point for the entire game and sets up the necessary pixi.js app boiler plate stuff
as well as the necessary classes and functions for the remainder of the game.
*/

import * as PIXI from 'pixi.js';
import * as util from './classes/utility';
import { GLOBAL_HEIGHT, GLOBAL_WIDTH } from './constants';
import { testGameState } from './classes/test';
import GridDrawer from './classes/grid';
import Ocean from './classes/ocean';
import Ship from './classes/ship';
// import FogOfWar from "./classes/fogOfWar";
import Sound, { setLaunchSound, setExplodeSound } from './classes/sound';
import * as lowerConsole from './classes/lowerConsole';
import * as missileControl from './classes/missileController';
import * as treasureTracker from './classes/treasureTracker';
import * as enemyTracker from './classes/enemyTracker';
import GameState from './classes/gameBoard';
import keyboardInit from './classes/keyboard';

const loader = PIXI.loader;

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
