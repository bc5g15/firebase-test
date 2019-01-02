import * as PIXI from 'pixi.js';

PIXI.loader.add('static/assets/Sprites/explosion.json').load();

export default class Explosion {
  constructor(app, pos) {
    let sheet =
      PIXI.loader.resources['static/assets/Sprites/explosion.json'].spritesheet;

    let anim = new PIXI.extras.AnimatedSprite(sheet.animations['explosion']);

    anim.x = pos[0];
    anim.y = pos[1];
    anim.loop = false;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.3;

    anim.onComplete = () => {
      anim.destroy();
    };

    app.stage.addChild(anim);
    anim.play();
  }
}
