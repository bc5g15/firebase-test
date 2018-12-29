//creates the sounds used by the missiles

let launchSound;
let explodeSound;

export default class Sound {
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

export function setLaunchSound(sound) {
  launchSound = sound;
}

export function setExplodeSound(sound) {
  explodeSound = sound;
}

export function launch() {
  launchSound.play();
}

export function explode() {
  explodeSound.play();
}
