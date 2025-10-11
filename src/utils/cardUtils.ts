import { Card, Hand, Deck, Suit, Rank } from '../types/card';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Creates a standard 52-card deck
 */
export function createDeck(): Deck {
  const deck: Deck = [];
  
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        value: getCardValue(rank),
        displayValue: rank,
      });
    }
  }
  
  return deck;
}

/**
 * Creates multiple decks for shoe games
 */
export function createShoe(deckCount: number): Deck {
  const shoe: Deck = [];
  
  for (let i = 0; i < deckCount; i++) {
    shoe.push(...createDeck());
  }
  
  return shoe;
}

/**
 * Gets the numeric value of a card rank
 */
export function getCardValue(rank: Rank): number {
  if (rank === 'A') return 11; // Ace defaults to 11, will be adjusted in hand calculation
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank);
}

/**
 * Shuffles a deck using Fisher-Yates algorithm
 */
export function shuffleDeck(deck: Deck): Deck {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Deals a card from the top of the deck
 */
export function dealCard(deck: Deck): { card: Card; remainingDeck: Deck } {
  if (deck.length === 0) {
    throw new Error('Cannot deal from empty deck');
  }
  
  const card = deck[0];
  const remainingDeck = deck.slice(1);
  
  return { card, remainingDeck };
}

/**
 * Creates an empty hand
 */
export function createEmptyHand(): Hand {
  return {
    cards: [],
    total: 0,
    isSoft: false,
    isBlackjack: false,
    isBusted: false,
  };
}

/**
 * Adds a card to a hand and recalculates the hand value
 */
export function addCardToHand(hand: Hand, card: Card): Hand {
  const newCards = [...hand.cards, card];
  const { total, isSoft } = calculateHandValue(newCards);
  
  return {
    cards: newCards,
    total,
    isSoft,
    isBlackjack: newCards.length === 2 && total === 21,
    isBusted: total > 21,
  };
}

/**
 * Calculates the optimal value of a hand
 */
export function calculateHandValue(cards: Card[]): { total: number; isSoft: boolean } {
  let total = 0;
  let aceCount = 0;
  
  // First pass: count all cards, treating Aces as 11
  for (const card of cards) {
    if (card.rank === 'A') {
      aceCount++;
      total += 11;
    } else {
      total += card.value;
    }
  }
  
  // Second pass: adjust Aces from 11 to 1 if needed
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }
  
  return {
    total,
    isSoft: aceCount > 0 && total <= 21,
  };
}

/**
 * Gets the suit symbol for display
 */
export function getSuitSymbol(suit: Suit): string {
  const symbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };
  return symbols[suit];
}

/**
 * Gets the suit color for styling
 */
export function getSuitColor(suit: Suit): 'red' | 'black' {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
}

/**
 * Checks if a hand can be split
 */
export function canSplitHand(hand: Hand): boolean {
  if (hand.cards.length !== 2) return false;
  
  const [card1, card2] = hand.cards;
  return card1.value === card2.value;
}

/**
 * Checks if a hand can double down
 */
export function canDoubleDown(hand: Hand): boolean {
  return hand.cards.length === 2 && !hand.isBusted;
}

/**
 * Checks if a hand can surrender
 */
export function canSurrender(hand: Hand): boolean {
  return hand.cards.length === 2 && !hand.isBusted;
}
