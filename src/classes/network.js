import * as PIXI from 'pixi.js';
import * as firebase from 'firebase';
import $ from 'jquery';
import Game from './game';
import Ship from './ship';
import TypingChallenge from './typeChallengeInterface';

// initialise firebase
let config = {
  apiKey: 'AIzaSyABYPdWIF56Ff7HbPQ-nJfE9YY0Fcc_eeQ',
  authDomain: 'fir-test-222916.firebaseapp.com',
  databaseURL: 'https://fir-test-222916.firebaseio.com',
  projectId: 'firebase-test-222916',
  storageBucket: 'firebase-test-222916.appspot.com',
  messagingSenderId: '368557792160'
};
firebase.initializeApp(config);

export default class Communicator {
  constructor(state, me, token, channelId, initialMessage) {
    this.state = state;
    this.myId = me;
    this.token = token;
    this.channelId = channelId;
    this.initialMessage = initialMessage;

    this.handlers = {};
    this.channel = null;
    this.game = new Game(9);

    setTimeout(this.initialize.bind(this), 100);
  }

  onMessage(newState) {
    console.log('New Message');
    console.log(newState.token);

    if (newState.token in this.handlers) {
      this.handlers[newState.token](newState);
    } else {
      console.log('Unrecognised token: ' + newState.token);
    }
  }

  startGame() {
    console.log('Opening Game');
    console.log('Who am I?');
    console.log(this.state.me);
    this.handlers['open'] = newState => {
      if (!this.state.started) {
        this.state.started = true;

        //Add the new handlers
        this.handlers['move'] = this.moveShip.bind(this);
        this.handlers['hit'] = this.resolveHit.bind(this);
        this.handlers['destroyed'] = this.destroyShip.bind(this);
        this.handlers['new_user'] = this.updateSingleShip.bind(this);
        this.handlers['position'] = this.updateFullGameState.bind(this);
        this.handlers['typechallenge'] = this.createTypeTask.bind(this);
        this.handlers['game-over'] = this.gameOver.bind(this);
        $.post('/game/join');
      }
    };
    $.post('/game/open');
    this.game.init();
  }

  refreshUsers(newState) {
    let userStr = '';
    for (let x = 0; x < newState.users.length; x++) {
      userStr += newState.users[x].name + '<br>';
    }
    $('#users').html(userStr);
  }

  onOpened() {
    console.log('Opening Lobby');
    this.handlers['new-user'] = this.refreshUsers.bind(this);
    this.handlers['start-game'] = this.startGame.bind(this);
    $.post('/game/lobby/open');
  }

  joinLobby() {}

  openChannel() {
    // [START auth_login]
    // sign into Firebase with the token passed from the server
    firebase
      .auth()
      .signInWithCustomToken(this.token)
      .catch(function(error) {
        console.log('Login Failed: ', error.code);
        console.log('Error message: ', error.message);
      });
    // [END auth_login]
    console.log('Logged in');
    // [START add_listener]
    this.channel = firebase.database().ref('channels/' + this.channelId);
    // add a listener to the path that fires any time the
    // value of the data changes
    this.channel.on('value', data => {
      this.onMessage(data.val());
    });
    // [END add_listener]
    this.onOpened();
  }

  initialize() {
    // Always include the gamekey in our requests
    $.ajaxPrefilter(opts => {
      if (opts.url.indexOf('?') > 0) opts.url += '&g=' + this.state.gameKey;
      else opts.url += '?g=' + this.state.gameKey;
    });

    $('#start-game').click(() => {
      $('#start-game').hide();
      // startGame();
      $.post('/game/lobby/start');
    });

    this.openChannel();

    this.onMessage(this.initialMessage);
  }

  updateFullGameState(newState) {
    let tiles = newState.tiles;
    console.log(tiles);
    for (let x = 0; x < tiles.length; x++) {
      let tile = tiles[x];
      console.log(tile);
      if (!(tile.type in this.game.ships)) {
        this.game.ships[tile.type] = new Ship(
          this.game.app,
          this.game,
          tile.type,
          [tile.col, tile.row],
          tile.hitpoints,
          tile.type !== this.state.me
        );
        this.game.ships[tile.type].initShip();
        if (tile.type === this.state.me) {
          console.log('Resetting myself');
          this.game.initPlayerShip(this.game.ships[tile.type]);
          // createGreenSquare(myShip.sprite.position.x, myShip.sprite.position.y);
        }
      }
    }
  }

  updateSingleShip(newState) {
    let newShip = new Ship(
      this.game.app,
      this.game,
      newState.type,
      [newState.col, newState.row],
      newState.hitpoints,
      newState.type !== this.state.me
    );
    this.game.ships[newState.type] = newShip;
    newShip.initShip();
    if (newState.type === this.state.me) {
      console.log('Resetting myself');
      this.game.initPlayerShip(newShip);
      // createGreenSquare(myShip.sprite.position.x, myShip.sprite.position.y);
    }
  }

  moveShip(newState) {
    this.game.ships[newState.type].setPosition(newState.col, newState.row);
  }

  resolveHit(newState) {
    //Explosion
  }

  destroyShip(newState) {
    //Explosion
    this.game.ships[newState.type].sprite = PIXI.Sprite.fromImage(
      'static/assets/Sprites/shipDestroyed.png'
    ); //Changes the ship's
    // image to represent it being destroyed
    this.game.ships[newState.type].destroy();
  }

  createTypeTask(newState) {
    console.log(newState);
    this.game.challengetext = newState.text;
    //console.log(this.game.challengetext);
    this.game.challengedifficulty = newState.difficulty;
    let typingChal = new TypingChallenge(
      this.game.app,
      this.game.lowerConsole.FireButton.fireMissile.bind(
        this.game.lowerConsole.FireButton
      ),
      this.game.lowerConsole.FireButton.toggleButton.bind(
        this.game.lowerConsole.FireButton
      ),
      this.game.challengetext
    );
    typingChal.showChallenge();
  }

  gameOver(newState) {
    let winnerID = newState.tiles[0].type;
    let winnerName = newState.users.filter(u => u.uid === winnerID)[0].name;
    $('#game-over').html('Game Over: ' + winnerName + ' Wins!');
  }
}
