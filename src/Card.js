import React from 'react';
import Card from './model/Card';
import cards_spritesheet from '../public/cards_spritesheet.png';
import { numberToCssPx } from './lib/helpers';

const CARD_WIDTH_PX = 79;
const CARD_HEIGHT_PX = 123;

// maps card value to correct css value on card_sheet
const cardPositionCssMap = (() => {
  return new Map(Card.createDeck()
    .map((card) => {
      let xRank = card.rank.value;
      let ySuit = card.suit.value;

      if(card.suit === Card.Suit.HEARTS) { 
        ySuit -= 1;
      } else if(card.suit === Card.Suit.SPADES) {
        ySuit += 1;
      }

      if(card.rank === Card.Rank.ACE) {
        xRank = 0;
      } else {
        xRank += 1;
      }

      const objectPositionCss = 
        numberToCssPx(xRank * CARD_WIDTH_PX * -1) + " " + 
        numberToCssPx(ySuit * CARD_HEIGHT_PX * -1);
      return [card.value, objectPositionCss];
    })
  );
})();

const CardComponent = ({ card }) => { 
  if(card) {
    const objectPosition = cardPositionCssMap.get(card.value);

    return (
      <div>
        <img
          className="card__sprite"
          style={{ objectPosition }}
          src={cards_spritesheet}
        />
      </div>
    )
  }

  return (
    <div>
      <img
        className="card__sprite card__sprite--hidden"
        src={cards_spritesheet}
      />
    </div>
  )
}

export default CardComponent;