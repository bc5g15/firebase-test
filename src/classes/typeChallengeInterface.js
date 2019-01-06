/* eslint-disable no-unused-vars,no-alert */
import * as PIXI from 'pixi.js';
import Timer from 'easytimer.js';
import injector from 'pixi-multistyle-text-esnext';

export default class TypingChallenge {
  constructor(app, firingCB, btnToggleCB, chal) {
    injector(PIXI);

    this.bg = new PIXI.Graphics();
    this.bg.beginFill(0xe74c3c);
    this.bg.lineStyle(2, 0xffffff);
    this.bg.drawRect(0, 0, 800, 400);
    this.bg2 = new PIXI.Graphics();
    this.bg2.beginFill(0x000000);
    this.bg2.lineStyle(2, 0xffffff);
    this.bg2.drawRect(0, 400, 800, 400);

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
    this.scaleCont = new PIXI.Container();
    this.firingCB = firingCB;
    this.btnToggleCB = btnToggleCB;
    this.challenge = chal;
    this.finished = false;
    this.input = '';
    this.sanitisedInput = '';
    this.correct = 0;
    this.totalTyped = 0;
    this.counter = 0;

    this.app.stage.addChild(this.scaleCont);
    this.scaleCont.addChild(this.chalContainer, this.inputContainer);

    this.inputContainer.position.y = this.chalContainer.position.y / 2;

    this.challengeTimer = this.challengeTimer.bind(this);
    this.handleChallengeSize = this.handleChallengeSize.bind(this);

    this.chalContainer.addChild(this.bg);
    this.inputContainer.addChild(this.bg2);

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
    let totalTime = 500 / this.challenge.length;

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
      this.btnToggleCB();
    });
  }

  handleChallengeSize(timer, totalTime) {
    let scale = timer.getTimeValues().seconds / totalTime;
    //console.log(scale);
    let trans = 400 * (1 - scale);
    this.scaleCont.position.set(trans, trans);
    this.scaleCont.scale.set(scale);
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
      this.app.stage.removeChild(this.scaleCont);
      this.btnToggleCB();
    }
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
