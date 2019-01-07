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
import { testGameState } from './test';
import $ from 'jquery';

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

    // Array of treasures
    this.treasureArray = [];
    // Map of ships
    this.ships = {};

    this.id = 0;
    this.score = 20000;
    this.health = 1000;

    let sizeGridSquareX = GLOBAL_WIDTH / dimension;
    let sizeGridSquareY = GLOBAL_HEIGHT * 0.8 / dimension;
    this.challengetext = null;
    this.challengedifficulty = null;

    this.missiles = [];
    this.missileCount = 0;
    this.missileSpeedFactor = 4;
    this.missileSpeed = util.calculateMissileSpeed(
      this.missileSpeedFactor,
      this,
      sizeGridSquareX,
      sizeGridSquareY
    );

    this.ocean = new Ocean(app);

    this.gameGrid = new GameGrid(app, dimension);
    this.gameGrid.drawGrid();

    // Only run if we use webpack-dev-server
    if (process.env.NODE_ENV !== 'production') {
      let playerShip = new Ship(app, this, 0, [0, 0]);
      playerShip.initShip();
      this.initPlayerShip(playerShip); //Changed to always create a new myShip
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
    this.lowerConsole = new LowerConsole(app, this);
  }

  initPlayerShip(playerShip) {
    this.myShip = playerShip;
    // Disable interface on destroy
    this.myShip.on('destroyed', () => {
      this.lowerConsole.FireButton.showButton(false);
      this.squareHighlighter.showSquares(false);
    });
  }

  init() {
    console.log('Game init called');
    $('#userList').css('display', 'none');
    $('#pin').css('display', 'none');
    $('#h1lobby').css('display', 'none');
    $('#accuracyTracker').css('display', 'block');
    this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.display = 'block';
    this.app.renderer.view.style.left =
      ($(window).width() - GLOBAL_WIDTH) / 2 + 'px';
    this.app.renderer.autoResize = true;
    this.app.stage.interactive = true;
    $('#gameboard').append(this.app.view);

    // initialise keyboard input
    keyboardInit(this.app, this.mousePosition, this, this.myShip);

    // Only run if we use webpack-dev-server
    if (process.env.NODE_ENV !== 'production') {
      enemy.loadEnemies(this.app, this, testGameState());
    }

    this.app.ticker.add(delta => this.tick(delta));
  }

  initTreasure(locations = TEST_TREASURE_LOCATIONS) {
    // Load treasure based on array of coordinates;
    treasure.loadTreasure(this, locations);
  }

  tick(delta) {
    this.ocean.update(delta);
    missileControl.updateMissiles(this);
    this.squareHighlighter.updateSquare(this.mousePosition);
    enemy.updateDestroyedShips(this);
  }
}
