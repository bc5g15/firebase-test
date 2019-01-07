/* eslint-disable no-unused-vars,no-alert */
import * as PIXI from 'pixi.js';
import Timer from 'easytimer.js';
import MultiStyleText from 'pixi-multistyle-text';

export default class TypingChallenge {
  constructor(app, firingCB, btnToggleCB, chal) {
    // injector(PIXI);

    this.globals = require('../constants.js');
    this.bg = new PIXI.Graphics();
    this.bg.beginFill(0x333333);
    this.bg.lineStyle(2, 0xffffff);
    this.bg.drawRect(0, 0, 700, 375);
    this.bg2 = new PIXI.Graphics();
    this.bg2.beginFill(0x000000);
    this.bg2.lineStyle(2, 0xffffff);
    this.bg2.drawRect(0, 375, 800, 400);
    this.bg3 = new PIXI.Graphics();
    this.bg3.beginFill(0x00cc11);
    this.bg3.lineStyle(2, 0xffffff);
    this.bg3.drawRect(0, 750, 800, 25);

    this.bg.x = 50;
    this.bg.y = 50;

    this.textStyle = {
      default: {
        fontFamily: 'Arial',
        fontSize: '20px',
        fill: '#cccccc',
        align: 'center',
        leading: 20,
        wordWrap: true,
        wordWrapWidth: this.bg.width - 40
      },
      w: {
        fill: '#ff8888'
      },
      c: {
        fill: '#22FF25'
      }
    };
    this.app = app;
    this.chalContainer = new PIXI.Container();
    this.inputContainer = new PIXI.Container();
    this.barCont = new PIXI.Container();
    this.firingCB = firingCB;
    this.btnToggleCB = btnToggleCB;
    this.originalChal = chal;
    this.challenge = chal;
    this.finished = false;
    this.input = '';
    this.sanitisedInput = '';
    this.correct = 0;
    this.totalTyped = 0;
    this.counter = 0;
    this.userInputTxt;

    this.app.stage.addChild(this.chalContainer);

    this.app.stage.addChild(this.barCont);
    this.inputContainer.position.y = this.chalContainer.position.y / 2;

    this.challengeTimer = this.challengeTimer.bind(this);
    this.handleChallengeSize = this.handleChallengeSize.bind(this);

    this.chalContainer.addChild(this.bg);
    this.inputContainer.addChild(this.bg2);
    this.barCont.addChild(this.bg3);

    window.onkeypress = e => {
      if (e.key != 'Enter') {
        this.processInput(e);
      }
    };
    window.onkeydown = e => {
      if (e.key == 'Backspace') {
        this.processInput(e);
      }
    };
    document.body.appendChild(app.view);
  }

  challengeTimer() {
    let totalTime = this.challenge.length * 1.5;
    console.log('Total Time: ' + totalTime);
    let timer = new Timer();
    timer.start({
      countdown: true,
      startValues: { seconds: totalTime },
      target: { seconds: 0 }
    });

    timer.addEventListener('secondsUpdated', () =>
      this.handleChallengeSize(timer, totalTime)
    );

    timer.addEventListener('targetAchieved', () => {
      console.error('time limit reached');
      this.hideChallenge();
      this.btnToggleCB();
    });
  }

  handleChallengeSize(timer, totalTime) {
    let scale = timer.getTimeValues().seconds / totalTime;
    console.log('Scale: ' + scale);
    this.barCont.scale.x = scale;
  }

  processInput(event) {
    if (event.key == 'Backspace' && this.counter >= 8) {
      this.removeLastChar();
    } else if (event.key != 'Backspace') {
      this.validateInput(event.key);
      this.totalTyped++;
    }

    if (this.sanitisedInput.length == this.originalChal.length) {
      let tmp = this.calculateAccuracy();
      let msg = new PIXI.Text(
        'Challenge complete your accuracy was ' + tmp + '%'
      );

      msg.y = 100;
      alert("you're accuracy was " + tmp + '%');
      this.finished = true;

      if (tmp < 50) {
        alert(
          'cannot fire, accuracy was below 50%, you had ' + tmp + '% accuracy'
        );
      } else {
        this.firingCB();
      }
      this.app.stage.removeChild(this.scaleCont);
      this.hideChallenge();
      this.btnToggleCB();
    }
  }

  hideChallenge() {
    this.app.stage.removeChild(this.barCont);
    this.app.stage.removeChild(this.chalContainer);
    this.app.stage.removeChild(this.inputContainer);
  }

  showChallenge() {
    // this.challengeTimer();
    this.btnToggleCB();

    this.userInputTxt = new MultiStyleText(this.challenge, this.textStyle);
    this.userInputTxt.x = this.bg.x + 20;
    this.userInputTxt.y = this.bg.y;
    this.chalContainer.addChild(this.userInputTxt);
  }

  validateInput(char) {
    let tmp = this.challenge;
    let currentChar = tmp.charAt(this.counter);

    if (char != this.challenge.charAt(this.counter) && !this.finished) {
      this.challenge =
        tmp.slice(0, this.counter) +
        '<w>' +
        (currentChar == ' ' ? '_' : currentChar) +
        '</w>' +
        tmp.slice(this.counter + 1, tmp.length);
      this.counter += 8;
      this.userInputTxt.text = this.challenge;
    } else {
      this.challenge =
        tmp.slice(0, this.counter) +
        '<c>' +
        (currentChar == ' ' ? '_' : currentChar) +
        '</c>' +
        tmp.slice(this.counter + 1, tmp.length);

      this.counter += 8;

      this.userInputTxt.text = this.challenge;

      this.correct++;
    }

    this.sanitisedInput += char;
  }

  calculateAccuracy() {
    return this.correct / this.totalTyped * 100;
  }

  removeLastChar() {
    let currentTag = this.challenge.substring(this.counter - 4, this.counter);

    currentTag == '</c>' ? this.correct-- : null;

    let charToRemove = this.challenge.charAt(this.counter - 5);

    this.challenge =
      this.challenge.substring(0, this.counter - 8) +
      (charToRemove == '_' ? ' ' : charToRemove) +
      this.challenge.substring(this.counter, this.challenge.length);

    this.counter -= 8;

    this.userInputTxt.text = this.challenge;

    this.sanitisedInput = this.sanitisedInput.substring(
      0,
      this.sanitisedInput.length - 1
    );
  }
}
