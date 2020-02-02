import React, { useRef, useEffect, useState } from 'react';
import Card from './model/Card';
import cards_spritesheet from '../public/cards_spritesheet.png';
import { numberToCssPx } from './lib/helpers';

const CARD_WIDTH = 79;
const CARD_HEIGHT = 123;

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


export const Deck = ({ deck, cardAnimatorBuffer }) => {
  return (
    <div
      className="cards"
      style={{
        left: numberToCssPx(-CARD_WIDTH/2) ,
        top: numberToCssPx(-CARD_HEIGHT/2)
      }}
    >
      { deck.map((card, index) => (
          <DeckCard
            cardAnimatorBuffer={cardAnimatorBuffer}
            key={index}
            card={card}
            index={index}
          />
      ))}
    </div>
  )
}

const D_CARD_OFFSETS = 8;
const D_CARD_OFFSET_PX = 2;

const DeckCard = ({ card, index, cardAnimatorBuffer }) => {
  const ref = useRef(null);

  useEffect(() => {
    cardAnimatorBuffer.set(
      card.value,
      ref.current.getBoundingClientRect()
    )
  }, [])

  const offsetIndex = Math.floor(index * D_CARD_OFFSETS / 52);
  const offsetCss = numberToCssPx(offsetIndex * D_CARD_OFFSET_PX);
  
  return (
    <div
      ref={ref}
      className="card"
      key={index}
      style = {{
        zIndex: index,
        left: offsetCss,
        top: offsetCss
      }}
    >
    <CardImage card={null} />
  </div>
  )
}

const PH_BORDER_OFFSET_PX = 50;
const PH_CARD_OFFSET_PX = 15;

export const PlayerHand = ({ size, player, cardAnimatorBuffer }) => {
  if(!player.hand) return null;

  const cards = player.hand;

  const handWidth = 
    PH_CARD_OFFSET_PX * (13 - 1) + CARD_WIDTH;
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
          top: numberToCssPx(size/2 - CARD_HEIGHT - PH_BORDER_OFFSET_PX),
          left: - handWidth/2
        }}
      >
        {
          cards.map((card, index) => (
            <PlayerHandCard 
              transformCss={transformCss}
              cardAnimatorBuffer={cardAnimatorBuffer}
              card={card}
              index={index}
              key={index}
            />
        ))}
      </div>
    </div>
  )
}

const PlayerHandCard = ({ card, index, cardAnimatorBuffer, transformCss }) => {
  const ref = useRef(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const first = cardAnimatorBuffer.get(card.value);
    const last = ref.current.getBoundingClientRect();

    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;

    ref.current.animate([{
      transformOrigin: 'top left',
      transform: `
        translate(${deltaX}px, ${deltaY}px)
        ${transformCss}
      `
    }, {
      transformOrigin: 'top left',
      transform: 'none'
    }],

    {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'both'
    }
    )
  }, [])


  // transform 
  return (
    <div
      ref={ref}
      className="card"
      style = {{
        zIndex: index,
        left: numberToCssPx(PH_CARD_OFFSET_PX * index)
      }}
    >
      <CardImage card={card} />
    </div>
  )
}
