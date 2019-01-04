/* eslint-disable no-unused-vars */
import * as PIXI from 'pixi.js';
import injector from 'pixi-multistyle-text-esnext';

export default class TypingChallenge {
  constructor(app, firingCB, chal) {
    injector(PIXI);

    const txtStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 20,
      fontWeight: 'bold'
    });
    let bg = new PIXI.Graphics();
    bg.beginFill(0x00000);
    bg.lineStyle(2, 0xffffff);
    bg.drawRect(0, 0, 800, 770);
    let bg2 = new PIXI.Graphics();
    bg2.beginFill(0x000000);
    bg2.lineStyle(2, 0xffffff);
    bg2.drawRect(0, 400, 800, 770 / 2);

    this.app = app;
    this.chalContainer = new PIXI.Container();
    this.inputContainer = new PIXI.Container();
    this.firingCB = firingCB;
    this.challenge = chal;
    console.log('challenge in constructor: ', this.challenge);
    this.finished = false;
    this.input = '';
    this.sanitisedInput = '';
    this.userInput;
    this.correct = 0;
    this.totalTyped = 0;
    this.counter = 0;

    this.app.stage.addChild(this.chalContainer, this.inputContainer);
    this.chalContainer.addChild(bg);
    this.inputContainer.addChild(bg2);
    this.inputContainer.position.y = this.chalContainer.position.y / 2;

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
    if (event.key == 'Backspace' && this.input.length > 0) {
      this.removeLastChar();
      this.counter--;
    } else if (event.key != 'Backspace') {
      this.validateInput(event.key);
      this.counter++;
      this.totalTyped++;
    }
    console.log('current length of input: ', this.sanitisedInput.length);
    console.log('length of challenge: ', this.challenge.length);

    if (this.sanitisedInput.length == this.challenge.length) {
      let tmp = this.calculateAccuracy();
      let msg = new PIXI.Text(
        'Challenge complete your accuracy was ' + tmp + '%'
      );

      msg.y = 100;
      // this.chalContainer.addChild(msg);
      alert("you're accuracy was " + tmp + '%');
      this.finished = true;

      if (tmp < 50) {
        alert(
          'cannot fire, accuracy was below 50%, you had ' + tmp + '% accuracy'
        );
      } else {
        this.firingCB();
      }
      this.app.stage.removeChild(this.chalContainer);
      this.app.stage.removeChild(this.inputContainer);
    }
  }

  showChallenge() {
    this.userInputTxt = new PIXI.MultiStyleText(this.input, {
      default: {
        fontFamily: 'Arial',
        fontSize: '20px',
        fill: '#cccccc',
        align: 'center'
      },
      w: {
        fill: '#ff8888'
      }
    });
    this.userInputTxt.y = 400;
    let tmp = new PIXI.MultiStyleText(this.challenge, {
      default: {
        fontFamily: 'Arial',
        fontSize: '20px',
        fill: '#cccccc',
        align: 'center'
      }
    });

    this.chalContainer.addChild(tmp);
    this.inputContainer.addChild(this.userInputTxt);
  }

  validateInput(char) {
    if (char != this.challenge.charAt(this.counter) && !this.finished) {
      this.input += '<w>' + char + '</w>';
      this.sanitisedInput += char;
      this.userInputTxt.text = this.input;
    } else {
      this.input += char;
      this.sanitisedInput += char;
      this.userInputTxt.text = this.input;
      this.correct++;
    }
  }

  calculateAccuracy() {
    console.log('correct letters: ', this.correct);
    console.log('total typed: ', this.totalTyped);
    return this.correct / this.totalTyped * 100;
  }

  removeLastChar() {
    if (this.input.substr(this.input.length - 4, this.input.length) == '</w>') {
      this.input = this.input.substr(0, this.input.length - 8);
    } else {
      console.log(
        'removing last letter: ',
        this.input.substr(0, this.input.length - 1)
      );
      this.input = this.input.substr(0, this.input.length - 1);
      this.correct--;
    }
    this.sanitisedInput = this.sanitisedInput.substr(
      0,
      this.sanitisedInput.length - 1
    );
    this.userInputTxt.text = this.input;
  }
}
