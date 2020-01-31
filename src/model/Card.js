const Rank = function(value, name) {
  this.value = value;
  this.name = name;
}

Rank.TWO = new Rank(0, "Two");
Rank.THREE = new Rank(1, "Three");
Rank.FOUR = new Rank(2, "Four");
Rank.FIVE = new Rank(3, "Five");
Rank.SIZE = new Rank(4, "Six");
Rank.SEVEN = new Rank(5, "Seven");
Rank.EIGHT = new Rank(6, "Eight");
Rank.NINE = new Rank(7, "Nine");
Rank.TEN = new Rank(8, "Ten");
Rank.JACK = new Rank(9, "Jack");
Rank.QUEEN = new Rank(10, "Queen");
Rank.KING = new Rank(11, "King");
Rank.ACE = new Rank(12, "Ace");


const Suit = function(value, name) {
  this.value = value;
  this.name = name;
};

Suit.CLUBS = new Suit(0, "Clubs");
Suit.DIAMONDS = new Suit(1, "Diamonds");
Suit.SPADES = new Suit(2, "Spades");
Suit.HEARTS = new Suit(3, "Hearts");

const Card = function(rank, suit) {
  this.rank = rank;
  this.suit = suit;
  this.value = rank.value + suit.value * 13;
};

Card.createDeck = function() {
  return Object.values(Suit)
    .map((suit) => Object.values(Rank)
      .map((rank) => new Card(rank, suit)))
    .reduce((prev, current) => prev.concat(current))
}

Card.Rank = Rank;
Card.Suit = Suit;

Card.prototype = {
  constructor: Card,
  name: function() {
    return this.rank.name + " of " + this.suit.name;
  },
  _scoreMap: function() {
    return new Map(Card.createDeck()
      .map((card) => {
        const score = (() => {
          if(card.suit === Card.Suit.HEARTS) {
            return 1;
          } else if (
            card.rank === Card.Rank.QUEEN && card.suit === Card.Suit.SPADES) {
            return 13;
          } else {
            return 0;
          }
        })();
        return [card.value, score];
      })
    );
  }(),
  get score() {
    return this._scoreMap.get(this.value);
  }
}

export default Card;