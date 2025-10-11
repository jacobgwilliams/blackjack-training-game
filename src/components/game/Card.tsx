import React from 'react';
import { Card as CardType } from '../../types/card';
import { getSuitSymbol, getSuitColor } from '../../utils/cardUtils';
import './Card.css';

interface CardProps {
  card: CardType;
  isHidden?: boolean;
  isDealing?: boolean;
  className?: string;
}

export function Card({ card, isHidden = false, isDealing = false, className = '' }: CardProps) {
  const suitSymbol = getSuitSymbol(card.suit);
  const suitColor = getSuitColor(card.suit);
  
  const cardClasses = [
    'card',
    `card--${suitColor}`,
    isHidden ? 'card--hidden' : '',
    isDealing ? 'card--dealing' : '',
    className,
  ].filter(Boolean).join(' ');
  
  if (isHidden) {
    return (
      <div className={cardClasses}>
        <div className="card-back">
          <div className="card-back-pattern"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cardClasses}>
      <div className="card-front">
        <div className="card-corner card-corner--top-left">
          <div className="card-rank">{card.displayValue}</div>
          <div className="card-suit">{suitSymbol}</div>
        </div>
        
        <div className="card-center">
          <div className="card-suit-large">{suitSymbol}</div>
        </div>
        
        <div className="card-corner card-corner--bottom-right">
          <div className="card-rank">{card.displayValue}</div>
          <div className="card-suit">{suitSymbol}</div>
        </div>
      </div>
    </div>
  );
}
