import Card from "./Card";

const CardView = function(card, index, transform) {
  this.card = card;
  this.transform = transform;
  this.index = index;
}

CardView.prototype = {
  equals: function(cardView) {
    return (
      this.transform.equals(cardView.transform)
      && this.card.value === cardView.card.value
      && this.index === cardView.index
    );
  },
  debug: function() {
    return [
      this.card.name, 
      this.transform.position.x,
      this.transform.position.y
    ];
  }
}

CardView.Transform = function(position, rotationIndex) {
  this.position = position;
  this.rotation = rotationIndex * 90;
}

CardView.Transform.prototype = {
  equals: function(transform) {
    return (
      this.position.equals(transform.position)
      && this.rotation === transform.rotation
    )
  }
}

const Queue = function() {
  this._arr = [];
  this._trace = [];
};

Queue.prototype = {
  constructor: Queue,
  enqueue: function(item) {
    this._arr.unshift(item);
    this._trace.unshift(item);
  },
  dequeue: function() {
    return this._arr.pop();
  },
  get first() {
    return this._arr[this._arr.length - 1];
  },
  get last() { 
    return this._arr[0]
  },
  get length() {
    return this._arr.length;
  }
}
CardView.Buffer = function() {
  this._map = null;
}

CardView.Buffer.prototype = {
  constructor: CardView.Buffer,
  init: function() {
    this._map = new Map(
      [...Array(52)].map((_, index) => [index, new Queue()])
    );
  },
  trace: function(cardView) {
    return this._getQueue(cardView)._trace;
  },
  _getQueue: function(cardView) {
    return this._map.get(cardView.card.value);
  },
  addTransition: function(cardView) {
    const queue = this._getQueue(cardView);

    if(!queue.last.equals(cardView)) {
      queue.enqueue(cardView);
    }
  },
  debug: function(cardView) {
    const queue = this._getQueue(cardView);
    console.log(...queue._arr.map((cardView) => cardView.debug()));
  },
  getCardView: function(cardView) {
    const queue = this._getQueue(cardView);
    if(
      queue.length === 0 ||
      !queue.last.equals(cardView)
    ) {
      queue.enqueue(cardView);
    }
    return queue.first;
  },
  transition: function(cardView) {
    const queue = this._getQueue(cardView);

    if(queue.length > 1) return [queue.dequeue(), queue.first];
    return null;
  }
}

export default CardView;