/* eslint-disable no-unused-vars */
import * as PIXI from 'pixi.js';
import injector from 'pixi-multistyle-text-esnext';

export default class typingChallenge {
  constructor(app, c) {
    injector(PIXI);

    const txtStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 20,
      fontWeight: 'bold'
    });

    this.app = app;
    this.chalContainer = new PIXI.Container();
    this.challenge = c;
    this.finished = false;
    this.input = '';
    this.userInput;
    this.correct = 0;
    this.totalTyped = 0;
    this.counter = 0;

    this.app.stage.addChild(this.chalContainer);

    window.onkeypress = e => {
      this.processInput(e);
    };
    window.onkeydown = e => {
      if (e.key == 'Backspace') {
        this.processInput(e);
      }
    };
    document.body.appendChild(app.view);
  }

  processInput(event) {
    if (event.key == 'Backspace') {
      this.removeLastChar();
      this.counter--;
    } else if (event.key) {
      this.validateInput(event.key);
      this.counter++;
      this.totalTyped++;
    }

    if (this.counter == this.challenge.length) {
      let msg = new PIXI.Text(
        'Challenge complete your accuracy was ' + this.calculateAccuracy() + '%'
      );
      msg.y = 100;
      app.stage.addChild(msg);
    }
  }

  showChallenge(challenge) {
    this.userInputTxt = new PIXI.MultiStyleText(this.input, {
      default: {
        fontFamily: 'Arial',
        fontSize: '20px',
        fill: '#cccccc',
        align: 'center'
      },
      incorrect: {
        fill: '#ff8888'
      }
    });
    this.userInputTxt.y = 50;

    this.chalContainer.addChild(
      new PIXI.Text(challenge, this.txtStyle),
      this.userInputTxt
    );
  }

  validateInput(char) {
    if (char != this.challenge.charAt(this.counter) && !this.finished) {
      this.input += '<incorrect>' + char + '</incorrect>';
      this.userInputTxt.text = this.input;
    } else {
      this.input += char;
      this.userInputTxt.text = this.input;
      this.correct++;
    }
  }

  calculateAccuracy() {
    return this.correct / this.totalTyped * 100;
  }

  removeLastChar() {
    this.input = this.input.substr(0, this.input.length - 1);
    this.userInputTxt.text = this.input;
  }
}
