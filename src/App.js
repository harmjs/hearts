import React, { useEffect, useState, createContext, } from 'react';
import { Deck, PlayerHand } from './components';
import { useObject } from './lib/customHooks';
import { numberToCssPx, random } from './lib/helpers';
import Game from './model/Game';
import Vect2D from './lib/Vect2D';

const SCREEN_SIZE = new Vect2D(800, 800);

const App = () => {
  const [game, updateGame] = useObject(new Game());
  const [cardBuffer, _] = useState(new Map());

  useEffect(() => {
    game.init(
      new Game.Controller(updateGame),
      new Game.State.Start()
    );
  }, []);

  const { players, deck } = game.state;

  // use context for size :P
  return (
    <PlayArea screenSize={SCREEN_SIZE}>
      { deck &&
        <Deck 
          screenSize={SCREEN_SIZE}
          deck={deck}
          cardBuffer={cardBuffer}
        />
      }
      { players && 
        <>
          { players.map((player, index) => (
            <PlayerHand 
              key={index}
              screenSize={SCREEN_SIZE}
              player={player}
              cardBuffer={cardBuffer}
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

/*
<div className="playarea__relative-center"
style={{
  top: numberToCssPx(size/2),
  left: numberToCssPx(size/2)
}}
>
*/