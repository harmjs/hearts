import React, { useRef, useEffect, useState } from 'react';
import Card from './model/Card';
import cards_spritesheet from '../public/cards_spritesheet.png';
import { numberToCssPx } from './lib/helpers';
import Vect2D from './lib/Vect2D';


const CARD_SIZE = new Vect2D(79, 123);

// maps card value to correct css value on card_sheet
const cardPositionCssMap = (() => {
  return new Map(Card.createFullDeck()
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
        numberToCssPx(xRank * CARD_SIZE.x * -1) + " " + 
        numberToCssPx(ySuit * CARD_SIZE.y * -1);
      return [card.value, objectPositionCss];
    })
  );
})();

const CardImage = ({ card }) => {
  if(card) {
    const objectPosition = cardPositionCssMap.get(card.value);

    return (
      <img
        className="card__image"
        style={{ objectPosition }}
        src={cards_spritesheet}
      />
    )
  } else {
    <img
      className="card__image card__image--back"
      src={cards_spritesheet}
    />
  }
}

const D_CARD_OFFSETS = 8;
const D_CARD_OFFSET_SIZE = new Vect2D(2, 2);

export const Deck = ({ deck, screenSize, cardBuffer }) => {
  const origin = screenSize.divide(2).subtract(CARD_SIZE.divide(2));

  return (
    <>
      { deck.map((card, index) => {
        const offsetIndex = Math.floor(index * D_CARD_OFFSETS / 52);
        const offset = D_CARD_OFFSET_SIZE.multiply(offsetIndex);
        const position = origin.add(offset);

        return (
          <CardComponent
            key={index}
            card={card}
            position={position}
            rotationIndex={0}
            cardBuffer={cardBuffer}
          />
      )})}
    </>
  );
}

const BORDER_FACTOR = 9/10;
const PH_CARD_OFFSET_X = 15;

export const PlayerHand = ({ player, screenSize, cardBuffer }) => {
  if (!player.hand) return null;

  const center = screenSize.divide(2);
  const totalHandWidth = PH_CARD_OFFSET_X * 12 + CARD_SIZE.x;

  const translate = new Vect2D(
    -totalHandWidth/2,
    center.y*BORDER_FACTOR - CARD_SIZE.y
  );
  
  const rotation = player.value * Math.PI/2;

  return (
    <>
      { player.hand.map((card, index) => {
          const origin = new Vect2D(PH_CARD_OFFSET_X * index, 0);

          const position = origin
            .add(translate)
            .rotate(rotation)
            .add(center);

        return (
          <CardComponent
            cardBuffer={cardBuffer}
            key={index}
            card={card}
            position={position}
            rotationIndex={player.value}
          />
      )})}
    </>
  );
};


const CardComponent = ({ 
  card, index, position, rotationIndex, cardBuffer 
}) => {

  const ref = useRef(null);

  useEffect(() => {
    if(!cardBuffer.has(card.value)) {
      cardBuffer.set(card.value, { position, rotationIndex });

    } else {
      const prevEntry = cardBuffer.get(card.value);
      const deltaPos = prevEntry.position.subtract(position);

      ref.current.animate([{
        transformOrigin: 'top left',
        transform: `
          translate(${numberToCssPx(deltaPos.x)}, ${numberToCssPx(deltaPos.y)})
        `
      }, {
        transformOrigin: 'top left',
        transform: `
          rotate(${rotationIndex * 90}deg)
        `,
      }], {
        duration: 300,
        easing: 'ease-in-out',
      })
    }
  }, [])

  // rotate(${prevEntry.rotationIndex * 90}deg)

  return(
    <div
      ref={ref}
      style={{
        position: "absolute",
        transform: "rotate(" + rotationIndex * 90 + "deg)",
        zIndex: numberToCssPx(52 - index),
        left: numberToCssPx(position.x),
        top: numberToCssPx(position.y)
      }}
    >
      <CardImage 
        card={card}
      />
    </div>
  )
}