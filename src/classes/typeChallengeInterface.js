/* eslint-disable no-unused-vars */
import * as PIXI from 'pixi.js';

const loader = PIXI.loader;
const app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });

let finished = false;
let input = '';
let userInputTxt;
let challenge = '';
let correct = 0;
let totalTyped = 0;
let counter = 0;

const txtStyle = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 20,
  fontStyle: 'italic',
  fontWeight: 'bold'
});

window.onkeydown = e => {
  if (e.key == 'Backspace') {
    console.log('backspace entered..... removing last entered char');
    counter--;
    removeLastChar();
  } else {
    validateInput(e.key);
  }
};

export default function typeChallengeInterface(challenge) {
  document.body.appendChild(app.view);

  showChallenge(challenge);
}

function showChallenge(challenge) {
  let richText = new PIXI.Text(challenge, txtStyle);
  userInputTxt = new PIXI.Text(input, txtStyle);
  userInputTxt.y = 50;

  app.stage.addChild(richText, userInputTxt);
}

function validateInput(char) {
  totalTyped++;

  if (char != challenge.charAt(counter)) {
    console.log('wrong character entered: ', char);
    // TODO: highlight wrong character
    input += char;
    updateUserInput();
  } else {
    correct++;
    input += char;
    updateUserInput();
  }
}

function updateUserInput() {
  userInputTxt.setText(input);
}

function removeLastChar() {
  input = input.substr(0, input.length - 1);
  updateUserInput();
  console.log('INPUT AFTER REMOVE: ', input);
}
