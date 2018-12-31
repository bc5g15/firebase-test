/* eslint-disable no-unused-vars */
import * as PIXI from 'pixi.js';
import injector from 'pixi-multistyle-text-esnext';
injector(PIXI);
const loader = PIXI.loader;
const app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });

let finished = false;
let input = '';
let userInputTxt;
let challenge;
let correct = 0;
let totalTyped = 0;
let counter = 0;

const txtStyle = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 20,
  fontWeight: 'bold'
});

window.onkeypress = e => {
  processInput(e);
};
window.onkeydown = e => {
  if (e.key == 'Backspace') {
    processInput(e);
  }
};

export default function typeChallengeInterface(c) {
  document.body.appendChild(app.view);
  challenge = c;
  showChallenge(challenge);
}

function processInput(event) {
  if (event.key == 'Backspace') {
    removeLastChar();
    counter--;
  } else if (event.key) {
    validateInput(event.key);
    counter++;
    totalTyped++;
  }

  if (counter == challenge.length) {
    let msg = new PIXI.Text(
      'Challenge complete your accuracy was ' + correct / totalTyped * 100 + '%'
    );
    msg.y = 100;
    app.stage.addChild(msg);
  }
}

function showChallenge(challenge) {
  userInputTxt = new PIXI.MultiStyleText(input, {
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
  userInputTxt.y = 50;

  app.stage.addChild(new PIXI.Text(challenge, txtStyle), userInputTxt);
}

function validateInput(char) {
  if (char != challenge.charAt(counter) && !finished) {
    input += '<incorrect>' + char + '</incorrect>';
    userInputTxt.text = input;
  } else {
    input += char;
    userInputTxt.text = input;
    correct++;
  }
}

function removeLastChar() {
  input = input.substr(0, input.length - 1);
  userInputTxt.text = input;
}
