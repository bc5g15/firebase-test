/*
This class will be used to prevent the player from seeing ships on the map
that are not in the ships 'cone of sight', a 90 degree view of the grid
directly ahead of the ship. This class can be used to increase difficulty
for the early parts of the game, or for the whole game.
*/

import * as PIXI from 'pixi.js';
import { GLOBAL_WIDTH, GLOBAL_HEIGHT } from '../constants';

export default class FogOfWar {
  constructor(app) {
    this.app = app;
    this.tilingSprite = null;
    this.viewPort = null;
  }

  init(rotation, position) {
    let texture = PIXI.Texture.fromImage('/static/assets/Textures/fog.jpg');
    this.tilingSprite = new PIXI.extras.TilingSprite(
      texture,
      this.app.screen.width,
      this.app.screen.height * 0.8
    );

    this.tilingSprite.anchor.set(0, 0);
    this.app.stage.addChild(this.tilingSprite);

    this.createMask(rotation, position);
  }

  createMask(app, rotation, position) {
    let fogMask = new PIXI.Graphics();
    app.stage.addChild(fogMask);
    fogMask.position.x = GLOBAL_WIDTH / 2;
    fogMask.position.x = GLOBAL_HEIGHT / 2;
    fogMask.lineStyle(0);
    fogMask.alpha = 0;

    fogMask.beginFill(0xff3300);
    fogMask.drawRect(-500, 50, 1000, 1000);
    fogMask.endFill();
    this.fogMask = fogMask;

    this.tilingSprite.mask = fogMask;
  }

  updateFog(rotation, position) {}

  dissipate() {}

  accumulate() {}
}
