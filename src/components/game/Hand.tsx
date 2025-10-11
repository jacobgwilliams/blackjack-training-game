import React from 'react';
import { Hand as HandType } from '../../types/card';
import { Card } from './Card';
import './Hand.css';

interface HandProps {
  hand: HandType;
  title: string;
  isDealer?: boolean;
  showTotal?: boolean;
  className?: string;
}

export function Hand({ 
  hand, 
  title, 
  isDealer = false, 
  showTotal = true, 
  className = '' 
}: HandProps) {
  const handClasses = [
    'hand',
    isDealer ? 'hand--dealer' : 'hand--player',
    className,
  ].filter(Boolean).join(' ');
  
  const getTotalDisplay = () => {
    if (hand.cards.length === 0) return '0';
    if (hand.isBusted) return `${hand.total} (Bust)`;
    if (hand.isBlackjack) return '21 (Blackjack!)';
    if (hand.isSoft) return `${hand.total} (Soft)`;
    return hand.total.toString();
  };
  
  return (
    <div className={handClasses}>
      <div className="hand-header">
        <h3 className="hand-title">{title}</h3>
        {showTotal && (
          <div className="hand-total">
            {getTotalDisplay()}
          </div>
        )}
      </div>
      
      <div className="hand-cards">
        {hand.cards.map((card, index) => (
          <Card
            key={`${card.suit}-${card.rank}-${index}`}
            card={card}
            isHidden={isDealer && index === 1 && hand.cards.length === 2}
            isDealing={index === hand.cards.length - 1}
          />
        ))}
      </div>
      
      {hand.cards.length === 0 && (
        <div className="hand-empty">
          <div className="hand-empty-placeholder">
            No cards
          </div>
        </div>
      )}
    </div>
  );
}
