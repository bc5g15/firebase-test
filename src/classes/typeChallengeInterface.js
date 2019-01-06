/* eslint-disable no-unused-vars,no-alert */
import * as PIXI from 'pixi.js';
import Timer from 'easytimer.js';
import injector from 'pixi-multistyle-text-esnext';

export default class TypingChallenge {
  constructor(app, firingCB, btnToggleCB, chal) {
    injector(PIXI);

    this.globals = require('../constants.js');
    this.bg = new PIXI.Graphics();
    this.bg.beginFill(0x333333);
    this.bg.lineStyle(2, 0xffffff);
    this.bg.drawRect(0, 0, 800, 375);
    this.bg2 = new PIXI.Graphics();
    this.bg2.beginFill(0x000000);
    this.bg2.lineStyle(2, 0xffffff);
    this.bg2.drawRect(0, 375, 800, 400);
    this.bg3 = new PIXI.Graphics();
    this.bg3.beginFill(0x00cc11);
    this.bg3.lineStyle(2, 0xffffff);
    this.bg3.drawRect(0, 750, 800, 25);

    this.textStyle = {
      default: {
        fontFamily: 'Arial',
        fontSize: '20px',
        fill: '#cccccc',
        align: 'center'
      },
      w: {
        fill: '#ff8888'
      }
    };
    this.app = app;
    this.chalContainer = new PIXI.Container();
    this.inputContainer = new PIXI.Container();
    this.barCont = new PIXI.Container();
    this.firingCB = firingCB;
    this.btnToggleCB = btnToggleCB;
    this.challenge = chal;
    this.finished = false;
    this.input = '';
    this.sanitisedInput = '';
    this.correct = 0;
    this.totalTyped = 0;
    this.counter = 0;

    this.app.stage.addChild(this.chalContainer, this.inputContainer);

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
    //let trans = (this.globals.returnWidth()/2) * (1 - scale);
    //console.log("Global Width: " + this.globals.returnWidth() + " // Transform: " + trans);
    //this.scaleCont.position.set(trans, trans);
    this.barCont.scale.x = scale;
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

    if (this.sanitisedInput.length == this.challenge.length) {
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
    this.challengeTimer();
    this.btnToggleCB();
    this.userInputTxt = new PIXI.MultiStyleText(this.input, this.textStyle);
    this.userInputTxt.y = 400;
    let tmp = new PIXI.MultiStyleText(this.challenge, this.textStyle);

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
