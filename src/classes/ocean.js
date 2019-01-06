/*
This class initiates the ocean visuals and provides an update function for the game loop
to simulate ocean movement
*/

import * as PIXI from 'pixi.js';

export default class Ocean {
  constructor(app) {
    this.app = app;
    this.count = 0;
    this.tilingSprite = null;

    this.init();
  }

  // Initialise ocean as tiling sprite
  init() {
    let texture = PIXI.Texture.fromImage('/static/assets/Textures/water.jpg');
    this.tilingSprite = new PIXI.extras.TilingSprite(
      texture,
      this.app.screen.width * 1.5,
      this.app.screen.height * 1.5
    );

    this.tilingSprite.anchor.set(0.25, 0.25);
    this.app.stage.addChild(this.tilingSprite);
    this.app.stage.setChildIndex(this.tilingSprite, 0);
  }

  // Function used to update ocean position and scale to simulate ocean movement
  update(delta) {
    this.count += delta / 100;

    this.tilingSprite.tileScale.x = 1 + Math.sin(this.count) / 100;
    this.tilingSprite.tileScale.y = 1 + Math.cos(this.count) / 100;
    this.tilingSprite.position.x -= Math.sin(this.count) / 100;
    this.tilingSprite.position.y += Math.cos(this.count) / 100;
  }
}
