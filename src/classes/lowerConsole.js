/*
Creates the translucent white square at the bottom of the grid square
In future, this will be used to display information about the game to
the user.
*/

import * as PIXI from 'pixi.js';
import { GLOBAL_WIDTH, GLOBAL_HEIGHT } from '../constants';
import FireButton from './buttonManager';

export default class LowerConsole {
  constructor(app, gameBoard, myShip) {
    this.app = app;
    this.gameBoard = gameBoard;

    let lowerConsole = new PIXI.Graphics();
    lowerConsole.beginFill(0xd3d3d3, 0.55);
    lowerConsole.lineStyle(0, 0x000000, 0.5);
    lowerConsole.drawRect(0, GLOBAL_HEIGHT * 0.8, GLOBAL_WIDTH, GLOBAL_HEIGHT);
    this.lowerConsole = lowerConsole;

    app.stage.addChild(lowerConsole);

    this.FireButton = new FireButton(app, gameBoard, myShip);
  }
}
