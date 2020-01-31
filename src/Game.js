import React from 'react';
import Card from './model/Card';
import { Deck } from './components';

import { numberToCssPx, random } from './lib/helpers';

const deck = random.shuffle(Card.createDeck());

const [north, east, south, west] = Card.createDeck()
  .reduce((hands, card, index) => {
    hands[index % 4].push(card);
    return hands;
  }, [[], [], [], []]
);

const App = () => {
  return (
    <div>
      <PlayArea size={800} />
    </div>
  )
}

const PlayArea = ({ size }) => {
  return (
    <div
      className="playarea"
      style={{
        width: numberToCssPx(size),
        height: numberToCssPx(size)
      }}
    >
      <Deck
        size={size}
        cards={deck}
      />
    </div>
  )
};

export default App;