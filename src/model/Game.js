const Game = function() {
  this.state = null;
  this.scoreBoard = null;
}

Game.prototype = {
  constructor: Game,
  init: function() {

  }
}

const Player = function(name) {
  this.name = name;
  this.hand = null;
  this.discard = null;
}

const Round = function(state, number) {
  this.state = state;
  this.number = number;
  this.type = Round.types[number % Round.types.length];
  this.set = null;
}

Round.Type = function(isPass, direction) {
  this.isPass = isPass;
  this.direction = direction;
}

Round.Type.LIST = [
  new Round.Type(true, 1),
  new Round.Type(true, -1),
  new Round.Type(false, null)
];

const Trick = function(start) {
  this.state = null;
}