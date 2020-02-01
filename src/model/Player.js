const IPlayer = {
  name: null,
}

const Player = function(value, hand) {
  this.value = value;
  this.hand = hand;
  this.discard = null;
  this.name = null;
}

export default Player;