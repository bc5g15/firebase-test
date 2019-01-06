/*
The button manager adds the "fire button to the game and runs the "shoot" function
to fire a missile from the players position to the target position.
*/

import * as PIXI from 'pixi.js';
import * as util from './utility';
import * as missileControl from './missileController';
import { GLOBAL_WIDTH, GLOBAL_HEIGHT } from '../constants';
import TypingChallenge from './typeChallengeInterface';
import $ from 'jquery';

export default class FireButton {
  constructor(app, gameBoard) {
    this.app = app;
    this.gameBoard = gameBoard;

    //texture loading
    this.textureButton = new PIXI.Texture.fromImage(
      'static/assets/Sprites/buttonFire.png'
    );

    this.textureButtonDown = new PIXI.Texture.fromImage(
      'static/assets/Sprites/buttonFirePressed.png'
    );

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

  showButton(toggle) {
    this.button.visible = toggle;
  }

  toggleButton() {
    this.button.texture = this.textureButton;
    this.button.interactive = !this.button.interactive;
  }

  renderChallenge() {
    console.log('rendering challenge before firing');
    $.post('/gettask');
    this.button.texture = this.textureButtonDown;

    if (this.canShoot()) {
      let typingChal = new TypingChallenge(
        this.app,
        this.fireMissile.bind(this),
        this.toggleButton.bind(this),
        'test' // Just using test text for now
      );
      typingChal.showChallenge();
    }
  }

  // Can we shoot given target position?
  canShoot() {
    let pos = this.gameBoard.squareHighlighter.getPositionOfTargetSquare();
    let shipPos = [
      this.gameBoard.myShip.sprite.position.x,
      this.gameBoard.myShip.sprite.position.y
    ];

    return (
      util.calculateDistance(shipPos, pos) != 0 &&
      !this.gameBoard.myShip.isDestroyed
    );
  }

  fireMissile() {
    console.log(this.gameBoard.myShip);

    let pos = this.gameBoard.squareHighlighter.getPositionOfTargetSquare();
    let shipPos = [
      this.gameBoard.myShip.sprite.position.x,
      this.gameBoard.myShip.sprite.position.y
    ];

    let dist = util.calculateDistance(shipPos, pos);
    if (dist == 0) {
      return;
    }

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
        'Score after Shot: ' +
          this.gameBoard.challengedifficulty +
          ', Distance: ' +
          dist
      );
    } else {
      console.log('Not enough points to perform action!');
    }
  }

  //buttonPressed() {
  //this.button.texture = this.textureButtonDown;

  // let pos = this.gameBoard.squareHighlighter.getPositionOfTargetSquare();
  //let shipPos = [
  // this.gameBoard.myShip.sprite.position.x,
  // this.gameBoard.myShip.sprite.position.y
  // ];
  // let coords = getGridIndex(pos);
  // let dist = util.calculateDistance(shipPos, pos);

  //determines if the player can afford to shoot based on targets distance
  //if (util.canAfford(this.gameBoard)) {
  // missileControl.shoot(
  //    util.rotateTo(pos[0], pos[1], shipPos[0], shipPos[1]),
  //     {
  //      x: shipPos[0],
  //      y: shipPos[1]
  //    },
  //    this.gameBoard
  //  );

  //  console.log(
  //    'Score after Shot: ' + this.gameBoard.score + ', Distance: ' + dist
  //  );
  // } else {
  //   console.log('Not enough points to perform action!');
  // }
  //}

  buttonReleased() {
    this.button.texture = this.textureButton;
  }
}
