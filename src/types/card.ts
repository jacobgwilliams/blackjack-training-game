export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // Numeric value for calculations (Ace can be 1 or 11)
  displayValue: string; // Display value (A, 2, 3, ..., 10, J, Q, K)
}

export interface Hand {
  cards: Card[];
  total: number;
  isSoft: boolean; // True if hand contains an Ace counted as 11
  isBlackjack: boolean;
  isBusted: boolean;
}

export type Deck = Card[];

export interface CardPosition {
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}
