import React, { useEffect, useState, createContext, } from 'react';
import { Deck, PlayerHand } from './components';
import { useObject } from './lib/customHooks';
import { numberToCssPx, random } from './lib/helpers';
import Game from './model/Game';
import CardView from './model/CardView';

import { SCREEN_SIZE } from './constants'


const App = () => {
  const [game, updateGame] = useObject(new Game());
  const [cardViewBuffer] = useState(new CardView.Buffer());
    
  useEffect(() => {
    cardViewBuffer.init();
    game.init(
      new Game.Controller(updateGame),
      new Game.State.Start()
    );
  }, []);

  const { players, deck } = game.state;

  return (
    <PlayArea screenSize={SCREEN_SIZE}>
      { deck &&
        <Deck 
          screenSize={SCREEN_SIZE}
          deck={deck}
          cardViewBuffer={cardViewBuffer}
        />
      }
      { players && 
        <>
          { players.map((player, index) => (
            <PlayerHand 
              key={index}
              screenSize={SCREEN_SIZE}
              player={player}
              cardViewBuffer={cardViewBuffer}
            />
          ))}
        </>
      }
    </PlayArea>
  );
};

const PlayArea = ({ screenSize, children }) => {
  return (
    <div
      className="playarea"
      style={{
        width: numberToCssPx(screenSize.x),
        height: numberToCssPx(screenSize.y)
      }}
    >
      {children}
    </div>
  );
};

export default App;