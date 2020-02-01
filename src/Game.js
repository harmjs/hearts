import React from 'react';
import Card from './model/Card';
import { Deck, PlayerHand } from './components';
import Player from './model/Player';
import { useObject } from './lib/customHooks';

import { numberToCssPx, random } from './lib/helpers';

const deck = random.shuffle(Card.createDeck());

const hands = deck
  .reduce((hands, card, index) => {
    hands[index % 4].push(card);
    return hands;
  }, [[], [], [], []])
  .map((hands) => hands.sort((a, b) => a.value - b.value));

const players = hands.map((hand, index) => new Player(index, hand));


const App = () => {
  const game = useObject(new Game());

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
      <div className="playarea__relative-center"
        style={{
          top: numberToCssPx(size/2),
          left: numberToCssPx(size/2)
        }}
      >
        <Deck 
          cards={[]}
        />
        { players.map((player, index) => (
            <PlayerHand 
              key={index}
              size={size}
              player={player}
            />
          ))
        }
      </div>
    </div>
  )
};

export default App;