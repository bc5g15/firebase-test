import * as PIXI from 'pixi.js';
import { GLOBAL_HEIGHT, GLOBAL_WIDTH } from '../constants';
import SquareHighlighter from './highlightedSquare';
import GameGrid from './grid';
import Ocean from './ocean';
import LowerConsole from './lowerConsole';
import Ship from './ship';
import * as util from './utility';
import * as treasure from './treasure';
import * as enemy from './enemy';
import keyboardInit from './keyboard';
import * as missileControl from './missileController';

const TEST_TREASURE_LOCATIONS = [[1, 1], [2, 2], [3, 3], [4, 4]];
export default class Game {
  constructor(dimension) {
    // Initialize new PIXI application
    const app = new PIXI.Application({
      width: GLOBAL_WIDTH, // default: 800
      height: GLOBAL_HEIGHT, // default: 600
      antialias: true, // default: false
      transparent: false, // default: false
      resolution: 1, // default: 1
      backgroundColor: 0x000000
    });
    this.app = app;
    this.mousePosition = app.renderer.plugins.interaction.mouse.global;

    this.dimension = dimension; // Grid size e.g. 9
    this.costOfMovement = 0;
    this.treasureArray = [];

    let sizeGridSquareX = GLOBAL_WIDTH / dimension;
    let sizeGridSquareY = GLOBAL_HEIGHT * 0.8 / dimension;

    this.ships = {};
    this.enemyShips = [];
    this.destroyedShips = [];

    this.id = 0;
    this.score = 20000;
    this.health = 1000;

    this.missiles = [];
    this.missileCount = 0;
    this.missileSpeedFactor = 4;
    this.missileSpeed = util.calculateMissileSpeed(
      this.missileSpeedFactor,
      this,
      sizeGridSquareX,
      sizeGridSquareY
    );

    this.gameState = [];

    this.ocean = new Ocean(app);

    this.gameGrid = new GameGrid(app, dimension);
    this.gameGrid.drawGrid();

    // Only run if we use webpack-dev-server
    if (process.env.NODE_ENV !== 'production') {
      this.myShip = new Ship(app, this, 0, [0, 0]);//Changed to always create a new myShip
      this.myShip.initShip();
    }

    this.squareHighlighter = new SquareHighlighter(app, this.gameGrid);
    // Only run if we use webpack-dev-server
    if (process.env.NODE_ENV !== 'production') {
      this.squareHighlighter.positionTarget(
        this.gameGrid.getIndexFromPoint([
          this.myShip.sprite.position.x,
          this.myShip.sprite.position.y
        ])
      );
    } else {
      this.squareHighlighter.positionTarget(0);
    }

    // initialises button and other data to display
    this.lowerConsole = new LowerConsole(app, this, this.myShip);
  }

  init() {
    console.log('Game init called');
    this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.display = 'block';
    this.app.renderer.autoResize = true;
    //app.renderer.resize(window.innerWidth, window.innerHeight);
    this.app.stage.interactive = true;
    document.body.appendChild(this.app.view);

    // initialise keyboard input
    keyboardInit(this.app, this.mousePosition, this, this.myShip);

    // loads enemy ships from game state data
    enemy.loadEnemies(this.app, this);

    this.app.ticker.add(delta => this.tick(delta));
  }

  initTreasure(locations = TEST_TREASURE_LOCATIONS) {
    // load treasure based on array of coordinates;
    treasure.loadTreasure(this, locations);
  }

  tick(delta) {
    this.ocean.update(delta);
    missileControl.updateMissiles(this);
    this.squareHighlighter.updateSquare(this.mousePosition);
    enemy.updateDestroyedShips(this);
  }
}
