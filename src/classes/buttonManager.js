/*
The button manager adds the "fire button to the game and runs the "shoot" function
to fire a missile from the players position to the target position.
*/

import * as PIXI from 'pixi.js';
import * as util from './utility';
import * as missileControl from './missileController';
import { GLOBAL_WIDTH, GLOBAL_HEIGHT } from '../constants';

export default class ButtonManager {
  constructor(app, gameBoard, myShip) {
    this.gameBoard = gameBoard;
    this.myShip = myShip;

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
    button.on('pointerdown', this.buttonPressed);
    button.on('pointerup', this.buttonReleased);
    this.button = button;

    //adding button to the game container.
    app.stage.addChild(button);
  }

  buttonPressed() {
    this.button.texture = this.textureButtonDown;

    let pos = this.gameBoard.squareHighlighter.getPositionOfGreenSquare();
    // let coords = getGridIndex(pos);
    let dist = util.calculateDistance(
      [this.myShip.positionExact[0], this.myShip.positionExact[1]],
      pos
    );

    //determines if the player can afford to shoot based on targets distance
    if (util.canAfford(this.gameBoard)) {
      missileControl.shoot(
        util.rotateTo(
          pos[0],
          pos[1],
          this.gameBoard.myShip.positionExact[0],
          this.gameBoard.myShip.positionExact[1]
        ),
        {
          x: this.gameBoard.myShip.positionExact[0],
          y: this.gameBoard.myShip.positionExact[1]
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