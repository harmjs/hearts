import React, { useEffect, useState } from 'react';
import { Deck, PlayerHand } from './components';
import { useObject } from './lib/customHooks';
import { numberToCssPx, random } from './lib/helpers';
import Game from './model/Game';

const App = () => {
  const size = 800;
  const [game, updateGame] = useObject(new Game());
  const [cardAnimatorBuffer, setCardAnimatorBuffer] = useState(new Map());

  useEffect(() => {
    game.init(
      new Game.Controller(updateGame),
      new Game.State.Start()
    );
  }, []);

  const { players, deck } = game.state;

  // use context for size :P
  return (
    <PlayArea size={size}>
      { deck &&
        <Deck 
          size={size}
          deck={deck}
          cardAnimatorBuffer={cardAnimatorBuffer}
        />
      }
      { players && 
        <>
          { players.map((player, index) => (
            <PlayerHand 
              key={index}
              size={size}
              player={player}
              cardAnimatorBuffer={cardAnimatorBuffer}
            />
          ))}
        </>
      }
    </PlayArea>
  )
}

const PlayArea = ({ size, children }) => {
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
        { children }
      </div>
    </div>
  )
};

export default App;