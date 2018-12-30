/* eslint-disable no-unused-vars */
import * as PIXI from 'pixi.js';

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
  fontStyle: 'italic',
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

    console.log('backspace entered..... removing last entered char');
  } else if (event.key) {
    validateInput(event.key);
    counter++;
    totalTyped++;
  }

  console.log('total: ', totalTyped);

  if (counter == challenge.length) {
    console.log('challenge length: ', challenge.length);
    let msg = new PIXI.Text(
      'Challenge complete your accuracy was ' + correct / totalTyped * 100 + '%'
    );
    msg.y = 70;
    app.stage.addChild(msg);
  }
}

function showChallenge(challenge) {
  userInputTxt = new PIXI.Text(input, txtStyle);
  userInputTxt.y = 50;

  app.stage.addChild(new PIXI.Text(challenge, txtStyle), userInputTxt);
}

function validateInput(char) {
  console.log('counter: ', counter);

  if (char != challenge.charAt(counter) && !finished) {
    // TODO: highlight wrong character
    input += char;
    updateUserInput();
    console.log('incorrect character entered');
  } else {
    input += char;
    updateUserInput();

    correct++;

    console.log('correct character entered');
  }

  console.log('##################################################');
  // console.log("counter: ", counter);
  console.log('current char to type: ', challenge.charAt(counter));
  console.log('char entered: ', char);
  console.log('correct: ', correct);
  console.log('##################################################');
}

function updateUserInput() {
  userInputTxt.text = input;
}

function removeLastChar() {
  input = input.substr(0, input.length - 1);
  updateUserInput();
  console.log('INPUT AFTER REMOVE: ', input);
}
