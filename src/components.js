import React, { useRef, useEffect, useState } from 'react';
import Card from './model/Card';
import CardView from './model/CardView';
import cards_spritesheet from '../public/cards_spritesheet.png';
import { numberToCssPx } from './lib/helpers';
import Vect2D from './lib/Vect2D';

import { ANIMATION_SPEED_FACTOR } from './constants';


const CARD_SIZE = new Vect2D(79, 123);

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

export const Deck = ({ deck, screenSize, cardViewBuffer }) => {
  const origin = screenSize.divide(2).subtract(CARD_SIZE.divide(2));

  return (
    <>
      { deck.map((card, index) => {
        const offsetIndex = Math.floor(index * D_CARD_OFFSETS / 52);
        const offset = D_CARD_OFFSET_SIZE.multiply(offsetIndex);
        const position = origin.add(offset);
        
        const cardView = new CardView(
          card, 
          index,
          new CardView.Transform(position, 0),
        );

        return (
          <CardComponent
            key={index}
            index={index}
            cardView={cardView}
            cardViewBuffer={cardViewBuffer}
          />
      )})}
    </>
  );
}

const BORDER_FACTOR = 9/10;
const PH_CARD_OFFSET_X = 15;

export const PlayerHand = ({ player, screenSize, cardViewBuffer }) => {

  if (!player.hand) return null;

  const center = screenSize.divide(2);
  const totalHandWidth = PH_CARD_OFFSET_X * (player.hand.length - 1) + CARD_SIZE.x;

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

        const cardView = new CardView(
          card, 
          index,
          new CardView.Transform(position, player.value, index),
        );

        return (
          <CardComponent
            key={index}
            cardView={cardView}
            cardViewBuffer={cardViewBuffer}
          />
      )})}
    </>
  );
};

const animateTransition = function(elem, prevTransform, transform) {
  const deltaTranslate = prevTransform.position.subtract(transform.position);
  return elem.animate([{
    transformOrigin: 'top left',
    transform: `
      translate(
        ${deltaTranslate.x}px, 
        ${deltaTranslate.y}px
      )
      rotate(
        ${prevTransform.rotation}deg
      )
      `
  }, {
    transformOrigin: 'top left',
    transform: `
      rotate(
        ${transform.rotation}deg
      )
    `
  }],{
    duration: deltaTranslate.magnitude() / ANIMATION_SPEED_FACTOR,
    fill: 'both',
    easing: 'ease'
  });
}

const CardComponent = ({ cardView, cardViewBuffer }) => {
  const [activeCardView, setActiveCardView] = useState(
    cardViewBuffer.getCardView(cardView)
  );

  const [isAnimating, setAnimating] = useState(false);

  const ref = useRef();

  function recurseTransition(transition) {
    const [pastCardView, futureCardView] = transition;

    setActiveCardView(futureCardView);

    const animation = animateTransition(
      ref.current,
      pastCardView.transform,
      futureCardView.transform
    );

    animation.onfinish = () => {
      const nextTransition = cardViewBuffer.transition(futureCardView);

      if(nextTransition) {
        recurseTransition(nextTransition);
      } else {
        setAnimating(false);
      }
    };
  }

  useEffect(() => {
    cardViewBuffer.addTransition(cardView);

    if(!isAnimating) {
      const transition = cardViewBuffer.transition(cardView);
      if(transition) {
        setAnimating(true);
        recurseTransition(transition);
      }
    }
  }, [cardView]);

  const { card, transform, index } = activeCardView;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        transform: "rotate(" + transform.rotation + "deg)",
        zIndex: numberToCssPx(52 - index),
        left: numberToCssPx(transform.position.x),
        top: numberToCssPx(transform.position.y),
      }}
    >
      <CardImage 
        card={card}
      />
    </div>
  );
};