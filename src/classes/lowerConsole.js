/*
Creates the translucent white square at the bottom of the grid square
In future, this will be used to display information about the game to
the user.
*/

import * as PIXI from 'pixi.js';
import { GLOBAL_WIDTH, GLOBAL_HEIGHT } from '../constants';

let lowerConsole;

export function initLowerConsole(app) {
  lowerConsole = new PIXI.Graphics();
  lowerConsole.beginFill(0xd3d3d3, 0.55);
  lowerConsole.lineStyle(0, 0x000000, 0.5);
  lowerConsole.drawRect(0, GLOBAL_HEIGHT * 0.8, GLOBAL_WIDTH, GLOBAL_HEIGHT);

  app.stage.addChild(lowerConsole);

  // idk where this is --karl
  // initButtons();
}
