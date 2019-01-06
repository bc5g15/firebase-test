/*
The button manager adds the "fire button to the game and runs the "shoot" function
to fire a missile from the players position to the target position.
*/

import * as PIXI from 'pixi.js';
import * as util from './utility';
import * as missileControl from './missileController';
import TypingChallenge from './typeChallengeInterface';
import { GLOBAL_HEIGHT, GLOBAL_WIDTH } from '../constants';

export default class FireButton {
  constructor(app, gameBoard, myShip) {
    this.app = app;
    this.gameBoard = gameBoard;
    this.myShip = myShip;

    //texture loading
    this.textureButton = new PIXI.Texture.fromImage(
      'static/assets/Sprites/buttonFire.png'
    );

    this.textureButtonDown = new PIXI.Texture.fromImage(
      'static/assets/Sprites/buttonFirePressed.png'
    );
    this.fireMissile = this.fireMissile.bind(this);
    this.toggleButton = this.toggleButton.bind(this);

    //creating button and changing settings
    let button = new PIXI.Sprite(this.textureButton);
    button.buttonMode = true;
    button.interactive = true;
    button.anchor.set(0.5);
    button.x = GLOBAL_WIDTH * 0.75;
    button.y = GLOBAL_HEIGHT * 0.9;
    button.on('pointerdown', this.renderChallenge.bind(this));
    button.on('pointerup', this.buttonReleased.bind(this));
    this.button = button;

    //adding button to the game container.
    app.stage.addChild(button);
  }

  toggleButton() {
    this.button.texture = this.textureButton;
    this.button.interactive = !this.button.interactive;
  }

  renderChallenge() {
    console.log('rendering challenge before firing');
    let typingChal = new TypingChallenge(
      this.app,
      this.fireMissile,
      this.toggleButton,
      'test longer! challenge.'
    );
    typingChal.showChallenge();
    this.button.texture = this.textureButtonDown;
  }

  fireMissile() {
    console.log(this.myShip);

    let pos = this.gameBoard.squareHighlighter.getPositionOfTargetSquare();
    let shipPos = [
      this.myShip.sprite.position.x,
      this.myShip.sprite.position.y
    ];
    // let coords = getGridIndex(pos);
    let dist = util.calculateDistance(shipPos, pos);

    //determines if the player can afford to shoot based on targets distance
    if (util.canAfford(this.gameBoard)) {
      missileControl.shoot(
        util.rotateTo(pos[0], pos[1], shipPos[0], shipPos[1]),
        {
          x: shipPos[0],
          y: shipPos[1]
        },
        this.gameBoard
      );

      console.log(
        'Score after Shot: ' + this.gameBoard.score + ', Distance: ' + dist
      );
    } else {
      console.log('Not enough points to perform action!');
    }
  }

  buttonReleased() {
    this.button.texture = this.textureButton;
  }
}
