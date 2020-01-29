import React from 'react';
import Card from './model/Card';
import CardComponent from './Card';

import { numberToCssPx, random } from './lib/helpers';

const deck = random.shuffle(Card.createDeck());

const CARD_OVERLAP_WIDTH_PX = 15;

const HandComponent = ({ cards }) => {
  return (
    <div style={{
      //transform: "rotate(90deg)"
    }}>
      {
        cards.map((card, index) => {
          const left = numberToCssPx(CARD_OVERLAP_WIDTH_PX * index);

          return (
            <div
              key={index}
              className="card"
              style={{ 
                left,
                zIndex: index,
              }}
            >
              <CardComponent 
                key={index}
                card={card}
              />
            </div>
          );
        }) 
      }
    </div>
  );
}

export default () => {
  const cards = Card.createDeck();
  
  return (
    <div>
      <HandComponent 
        cards={deck}
      />
    </div>
  )
};