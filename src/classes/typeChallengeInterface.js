/* eslint-disable no-unused-vars */
import * as PIXI from 'pixi.js';

const loader = PIXI.loader;
const app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });

let finished = false;
let input = '';
let challenge = '';
let correct = 0;
let totalTyped = 0;
let accuracy = 0;
let counter = 0;

const txtStyle = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 20,
  fontStyle: 'italic',
  fontWeight: 'bold'
});

window.onkeydown = e => {
  if (e.key == 'Backspace') {
    counter--;
  }
  validateInput(e.key);
};

export default function typeChallengeInterface(challenge) {
  // this.challenge = c;
  let challengeArr = challenge.split('');

  document.body.appendChild(app.view);

  showChallenge(challenge);
}

function showChallenge(challenge) {
  var richText = new PIXI.Text(challenge, txtStyle);
  app.stage.addChild(richText);
}

function validateInput(char) {
  totalTyped++;

  if (char != challenge.charAt(counter)) {
    console.log('wrong character entered: ', char);
    // TODO: highlight wrong character
  }

  updateUserInput(char);
}

function updateUserInput(char) {
  input += char;
  let txt = new PIXI.Text(input, txtStyle);
  txt.y = 50;
  app.stage.addChild(txt);

  console.log('key pressed: ', char);
}

function adjustAccuracy() {
  accuracy = correct / challenge.length;
}
