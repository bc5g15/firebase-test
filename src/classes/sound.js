import * as PIXI from 'pixi.js';

let launchSound;
let explodeSound;
class Sound {
  constructor(src) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
    document.body.appendChild(this.sound);
  }

  play() {
    this.sound.cloneNode(true).play();
  }

  stop() {
    this.sound.pause();
  }
}

PIXI.loader.add('missileSprite', 'static/assets/Sprites/missile.png');

explodeSound = new Sound('static/assets/Sounds/explode.mp3');
launchSound = new Sound('static/assets/Sounds/launch.mp3');

export function playLaunchSound() {
  launchSound.play();
}

export function playExplodeSound() {
  explodeSound.play();
}
