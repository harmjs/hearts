import React from 'react';
import Card from './model/Card';
import cards_spritesheet from '../public/cards_spritesheet.png';
import { numberToCssPx } from './lib/helpers';

const CARD_WIDTH = 79;
const CARD_HEIGHT = 123;

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
        numberToCssPx(xRank * CARD_WIDTH * -1) + " " + 
        numberToCssPx(ySuit * CARD_HEIGHT * -1);
      return [card.value, objectPositionCss];
    })
  );
})();

const CardImage = ({ card }) => {
  if(card) {
    return <CardImageFront card={card} />
  } else {
    return <CardImageBack />
  }
}

const CardImageFront = ({ card }) => { 
  const objectPosition = cardPositionCssMap.get(card.value);

  return (
    <img
      className="card__image"
      style={{ objectPosition }}
      src={cards_spritesheet}
    />
  )
}

const CardImageBack = () => (
  <img
    className="card__image card__image--back"
    src={cards_spritesheet}
  />
);

const HAND_CARD_OFFSET = 15;
const BORDER_OFFSET = 50;

export const PlayerHand = ({ size, player }) => {
  if(!player.hand) return null;

  const cards = player.hand;

  const handWidth = 
    HAND_CARD_OFFSET * (cards.length - 1) + CARD_WIDTH;
  const transformCss = "rotate(" + player.value * 90 + "deg)";

  return (
    <div 
      style={{
        position: "absolute",
        transform: transformCss
      }}
    >
      <div
        style={{
          position: "relative",
          top: numberToCssPx(size/2 - CARD_HEIGHT - BORDER_OFFSET),
          left: - handWidth/2
        }}
      >
        {
          cards.map((card, index) => {
            return (
              <div
                className="card"
                key={index}
                style = {{
                  zIndex: index,
                  left: numberToCssPx(HAND_CARD_OFFSET * index)
                }}
              >
                <CardImage card={card} />
              </div>
            )})
          }
      </div>
    </div>
  )
}

export const Deck = ({ size, cards }) => {
  if(!cards) return null;

  const LENGTH = 52;
  const OFFSETS = 1;
  const OFFSET_PX = 2;

  return (
    <div
      className="cards"
      style={{
        left: numberToCssPx(-CARD_WIDTH/2) ,
        top: numberToCssPx(-CARD_HEIGHT/2)
      }}
    >
      {
        cards.map((card, index) => {
          const offsetIndex = Math.floor(index * OFFSETS / LENGTH);
          const offsetCss = numberToCssPx(offsetIndex * OFFSET_PX);

          return (
            <div
              className="card"
              key={index}
              style = {{
                zIndex: index,
                left: offsetCss,
                top: offsetCss
              }}
            >
              <CardImage card={card} />
            </div>
          )})
        }
    </div>
  )
}

const Hand = function() {
  
}