import Card from './Card';
import Player from './Player';

import { random } from '../lib/helpers';
import { GAME_DELAY_FACTOR } from '../constants';

const Game = function() {
  this.controller = null;
  this.state = new Game.State.Undefined();
}

Game.Controller = function(update) {
  this._update = update;
  this.shouldUpdate = false;
}

Game.Controller.prototype = {
  scheduleUpdate: function(game, override) {
    if(this.shouldUpdate || override) {
      game.state.onUpdate(game);
      this.shouldUpdate = false;
    }
    this._update();
  }
}

Game.prototype = {
  constructor: Game,
  init: function(controller, state) {
    this.controller = controller;
  
    state.onStart(this);

    this.state = state;
    this.controller.scheduleUpdate(this);
  },
  stateTransition: function(nextState) {
    this.state.onStop(this);
    nextState.onStart(this);

    this.state = nextState;
  }
}

Game.State = {};

const IState = {
  onStart: function() {},
  onStop: function() {},
  onUpdate: function() {},
};

Game.State.Undefined = function() {};
Game.State.Undefined.prototype = Object.assign(
  Object.create(IState),
  {
    constructor: Game.State.Undefined
  }
);

Game.State.Start = function(game) {
  this.deck = null;
  this.players = null;
  this.serveIntervalId = null;
}

Game.State.Start.prototype = Object.assign(
  Object.create(IState), {
    constructor: Game.State.Start,
    onStart: function(game) {
      this.players = [
        new Player(0), new Player(1),
        new Player(2), new Player(3)
      ];

      this.deck = random.shuffle(Card.createFullDeck());

      this.serveIntervalId = setInterval(
        () => this._serveCard(game), 
        GAME_DELAY_FACTOR * 25
      );
    },
    _serveCard: function(game) {
      if(this.deck.length) {
        const playerIndex = (this.deck.length - 1) % 4;
        const card = this.deck.pop();
        this.players[playerIndex].hand.push(card);

        game.controller.scheduleUpdate(game, true);
      } else {
        clearInterval(this.serveIntervalId);
        this._onServeComplete(game);
      }
    },
    _onServeComplete: function(game) {
      this.players.forEach((player) => {
        this.players.hand = player.hand.sort((a, b) => a.value - b.value)
      })
      game.controller.scheduleUpdate(game, true);
    }
  }
);

export default Game;