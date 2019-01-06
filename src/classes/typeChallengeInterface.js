/* eslint-disable no-unused-vars,no-alert */
import * as PIXI from 'pixi.js';
import Timer from 'easytimer.js';
import injector from 'pixi-multistyle-text-esnext';

export default class TypingChallenge {
  constructor(app, firingCB, btnToggleCB, chal) {
    injector(PIXI);

    this.bg = new PIXI.Graphics();
    this.bg.beginFill(0x000000);
    this.bg.lineStyle(2, 0xffffff);
    this.bg.drawRect(0, 0, 800, 400);

    this.textStyle = {
      default: {
        fontFamily: 'Arial',
        fontSize: '20px',
        fill: '#cccccc',
        align: 'center'
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
    this.scaleCont = new PIXI.Container();
    this.firingCB = firingCB;
    this.btnToggleCB = btnToggleCB;
    this.originalChal = chal;
    this.challenge = chal;
    this.sanitisedInput = '';
    this.correct = 0;
    this.totalTyped = 0;
    this.counter = 0;
    this.userInputTxt;

    this.app.stage.addChild(this.scaleCont);
    this.scaleCont.addChild(this.chalContainer, this.inputContainer);

    this.inputContainer.position.y = this.chalContainer.position.y / 2;

    this.challengeTimer = this.challengeTimer.bind(this);
    this.handleChallengeSize = this.handleChallengeSize.bind(this);

    this.chalContainer.addChild(this.bg);
    // this.inputContainer.addChild(this.bg2);

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
    let trans = 400 * (1 - scale);
    this.scaleCont.position.set(trans, trans);
    this.scaleCont.scale.set(scale);
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
      this.btnToggleCB();
    }
  }

  showChallenge() {
    // this.challengeTimer();
    this.btnToggleCB();

    // this.userInputTxt = new PIXI.MultiStyleText(this.input, this.textStyle);
    // this.userInputTxt.y = 400;
    // let tmp = new PIXI.MultiStyleText(this.challenge, this.textStyle);

    // this.chalContainer.addChild(textSample);
    // this.inputContainer.addChild(this.userInputTxt);

    this.userInputTxt = new PIXI.MultiStyleText(this.challenge, this.textStyle);
    this.chalContainer.addChild(this.userInputTxt);
  }

  validateInput(char) {
    console.log('##########################################');

    let tmp = this.challenge;
    let currentChar = tmp.charAt(this.counter);

    let charToAdd;

    if (char == ' ') {
      charToAdd = '_';
    } else {
      charToAdd = char;
    }
    // console.log("correct char to type: ", this.challenge.charAt(this.counter));
    if (char != this.challenge.charAt(this.counter) && !this.finished) {
      // console.log("1char typed: ", charToAdd);
      //
      // console.log("slice to counter BEFORE: ", tmp.slice(0, this.counter));
      // console.log("slice from counter BEFORE: ", tmp.slice(this.counter + 1, tmp.length));

      this.challenge =
        tmp.slice(0, this.counter) +
        '<w>' +
        (currentChar == ' ' ? '_' : currentChar) +
        '</w>' +
        tmp.slice(this.counter + 1, tmp.length);
      this.counter += 8;
      // //
      // console.log("updated challenge: ", this.challenge);
      // console.log("next char to check: ", this.challenge.charAt(this.counter));

      this.userInputTxt.text = this.challenge;
      // this.userInputTxt = new PIXI.MultiStyleText(this.challenge, this.textStyle);
    } else {
      // this.input += char;
      // this.sanitisedInput += char;
      // this.userInputTxt.text = this.input;
      // console.log("2char typed: ", charToAdd);

      // console.log("slice to counter BEFORE: ", tmp.slice(0, this.counter));
      // console.log("slice from counter BEFORE: ", tmp.slice(this.counter + 1, tmp.length));
      // console.log("adding char: ", tmp.charAt(this.counter));

      this.challenge =
        tmp.slice(0, this.counter) +
        '<c>' +
        (currentChar == ' ' ? '_' : currentChar) +
        '</c>' +
        tmp.slice(this.counter + 1, tmp.length);
      // console.log("updated challenge: ", this.challenge);

      this.counter += 8;

      this.userInputTxt.text = this.challenge;

      this.correct++;
    }
    console.log('##########################################\n\n');

    this.sanitisedInput += char;
    console.error('sanitised input after adding char: ', this.sanitisedInput);
  }

  calculateAccuracy() {
    console.log('correct letters: ', this.correct);
    console.log('total typed: ', this.totalTyped);
    return this.correct / this.totalTyped * 100;
  }

  removeLastChar() {
    console.log('##########################################');
    // console.log("challenge BEFORE: ", this.challenge);
    // console.log("counter BEFORE removing: ", this.counter);
    // console.log("char at counter: ", this.challenge.charAt(this.counter));

    // if(this.challenge.substring(this.challenge.length - 4))

    let currentTag = this.challenge.substring(this.counter - 4, this.counter);

    currentTag == '</c>' ? this.correct-- : null;

    let charToRemove = this.challenge.charAt(this.counter - 5);

    // console.log("char to remove: ", charToRemove);
    // console.log("substring to append: ", this.challenge.substring(this.counter, this.challenge.length));
    // console.log("appending to: ", this.challenge.substring(0, this.counter - 7) + charToRemove);

    this.challenge =
      this.challenge.substring(0, this.counter - 8) +
      (charToRemove == '_' ? ' ' : charToRemove) +
      this.challenge.substring(this.counter, this.challenge.length);
    // console.log("challenge after removing: ", this.challenge);

    // console.log("counter after removing: ", this.counter);

    this.counter -= 8;
    // console.log("counter AFTER removing: ", this.counter);
    // console.log("char at current counter: ", this.challenge.charAt(this.counter));
    //
    this.userInputTxt.text = this.challenge;
    //
    // console.log("challenge AFTER: ", this.challenge);
    // console.log("##########################################\n\n");

    this.sanitisedInput = this.sanitisedInput.substring(
      0,
      this.sanitisedInput.length - 1
    );
    console.error('sanitised input after removing: ', this.sanitisedInput);
  }
}
