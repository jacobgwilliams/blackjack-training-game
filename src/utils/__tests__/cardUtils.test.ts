import { 
  createDeck, 
  createShoe, 
  shuffleDeck, 
  dealCard, 
  calculateHandValue,
  getCardValue,
  canSplitHand,
  canDoubleDown,
  canSurrender 
} from '../cardUtils';
import { Card, Hand } from '../../types/card';

describe('cardUtils', () => {
  describe('createDeck', () => {
    it('should create a standard 52-card deck', () => {
      const deck = createDeck();
      expect(deck).toHaveLength(52);
    });

    it('should have all four suits', () => {
      const deck = createDeck();
      const suits = new Set(deck.map(card => card.suit));
      expect(suits.size).toBe(4);
      expect(suits.has('hearts')).toBe(true);
      expect(suits.has('diamonds')).toBe(true);
      expect(suits.has('clubs')).toBe(true);
      expect(suits.has('spades')).toBe(true);
    });

    it('should have all ranks', () => {
      const deck = createDeck();
      const ranks = new Set(deck.map(card => card.rank));
      expect(ranks.size).toBe(13);
    });
  });

  describe('createShoe', () => {
    it('should create multiple decks', () => {
      const shoe = createShoe(6);
      expect(shoe).toHaveLength(312); // 52 * 6
    });
  });

  describe('shuffleDeck', () => {
    it('should return a deck of the same length', () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);
      expect(shuffled).toHaveLength(52);
    });

    it('should contain all the same cards', () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);
      
      // Sort both decks by suit and rank for comparison
      const sortedOriginal = [...deck].sort((a, b) => 
        a.suit.localeCompare(b.suit) || a.rank.localeCompare(b.rank)
      );
      const sortedShuffled = [...shuffled].sort((a, b) => 
        a.suit.localeCompare(b.suit) || a.rank.localeCompare(b.rank)
      );
      
      expect(sortedOriginal).toEqual(sortedShuffled);
    });
  });

  describe('dealCard', () => {
    it('should deal the first card from the deck', () => {
      const deck = createDeck();
      const { card, remainingDeck } = dealCard(deck);
      
      expect(remainingDeck).toHaveLength(51);
      expect(card).toEqual(deck[0]);
    });

    it('should throw error for empty deck', () => {
      expect(() => dealCard([])).toThrow('Cannot deal from empty deck');
    });
  });

  describe('getCardValue', () => {
    it('should return correct values for number cards', () => {
      expect(getCardValue('2')).toBe(2);
      expect(getCardValue('5')).toBe(5);
      expect(getCardValue('10')).toBe(10);
    });

    it('should return 10 for face cards', () => {
      expect(getCardValue('J')).toBe(10);
      expect(getCardValue('Q')).toBe(10);
      expect(getCardValue('K')).toBe(10);
    });

    it('should return 11 for Ace', () => {
      expect(getCardValue('A')).toBe(11);
    });
  });

  describe('calculateHandValue', () => {
    it('should calculate simple hand values', () => {
      const cards: Card[] = [
        { suit: 'hearts', rank: '5', value: 5, displayValue: '5' },
        { suit: 'spades', rank: '7', value: 7, displayValue: '7' }
      ];
      
      const { total, isSoft } = calculateHandValue(cards);
      expect(total).toBe(12);
      expect(isSoft).toBe(false);
    });

    it('should handle Ace as 11 when beneficial', () => {
      const cards: Card[] = [
        { suit: 'hearts', rank: 'A', value: 11, displayValue: 'A' },
        { suit: 'spades', rank: '6', value: 6, displayValue: '6' }
      ];
      
      const { total, isSoft } = calculateHandValue(cards);
      expect(total).toBe(17);
      expect(isSoft).toBe(true);
    });

    it('should handle Ace as 1 when 11 would bust', () => {
      const cards: Card[] = [
        { suit: 'hearts', rank: 'A', value: 11, displayValue: 'A' },
        { suit: 'spades', rank: 'K', value: 10, displayValue: 'K' },
        { suit: 'clubs', rank: '5', value: 5, displayValue: '5' }
      ];
      
      const { total, isSoft } = calculateHandValue(cards);
      expect(total).toBe(16);
      expect(isSoft).toBe(false);
    });

    it('should handle multiple Aces correctly', () => {
      const cards: Card[] = [
        { suit: 'hearts', rank: 'A', value: 11, displayValue: 'A' },
        { suit: 'spades', rank: 'A', value: 11, displayValue: 'A' },
        { suit: 'clubs', rank: 'A', value: 11, displayValue: 'A' }
      ];
      
      const { total, isSoft } = calculateHandValue(cards);
      expect(total).toBe(13);
      expect(isSoft).toBe(true);
    });
  });

  describe('canSplitHand', () => {
    it('should return true for pairs', () => {
      const hand: Hand = {
        cards: [
          { suit: 'hearts', rank: '8', value: 8, displayValue: '8' },
          { suit: 'spades', rank: '8', value: 8, displayValue: '8' }
        ],
        total: 16,
        isSoft: false,
        isBlackjack: false,
        isBusted: false
      };
      
      expect(canSplitHand(hand)).toBe(true);
    });

    it('should return false for non-pairs', () => {
      const hand: Hand = {
        cards: [
          { suit: 'hearts', rank: '8', value: 8, displayValue: '8' },
          { suit: 'spades', rank: '9', value: 9, displayValue: '9' }
        ],
        total: 17,
        isSoft: false,
        isBlackjack: false,
        isBusted: false
      };
      
      expect(canSplitHand(hand)).toBe(false);
    });

    it('should return false for hands with more than 2 cards', () => {
      const hand: Hand = {
        cards: [
          { suit: 'hearts', rank: '8', value: 8, displayValue: '8' },
          { suit: 'spades', rank: '8', value: 8, displayValue: '8' },
          { suit: 'clubs', rank: '5', value: 5, displayValue: '5' }
        ],
        total: 21,
        isSoft: false,
        isBlackjack: false,
        isBusted: false
      };
      
      expect(canSplitHand(hand)).toBe(false);
    });
  });

  describe('canDoubleDown', () => {
    it('should return true for two-card hands', () => {
      const hand: Hand = {
        cards: [
          { suit: 'hearts', rank: '8', value: 8, displayValue: '8' },
          { suit: 'spades', rank: '3', value: 3, displayValue: '3' }
        ],
        total: 11,
        isSoft: false,
        isBlackjack: false,
        isBusted: false
      };
      
      expect(canDoubleDown(hand)).toBe(true);
    });

    it('should return false for busted hands', () => {
      const hand: Hand = {
        cards: [
          { suit: 'hearts', rank: 'K', value: 10, displayValue: 'K' },
          { suit: 'spades', rank: 'K', value: 10, displayValue: 'K' },
          { suit: 'clubs', rank: '5', value: 5, displayValue: '5' }
        ],
        total: 25,
        isSoft: false,
        isBlackjack: false,
        isBusted: true
      };
      
      expect(canDoubleDown(hand)).toBe(false);
    });
  });

  describe('canSurrender', () => {
    it('should return true for two-card hands', () => {
      const hand: Hand = {
        cards: [
          { suit: 'hearts', rank: '8', value: 8, displayValue: '8' },
          { suit: 'spades', rank: '8', value: 8, displayValue: '8' }
        ],
        total: 16,
        isSoft: false,
        isBlackjack: false,
        isBusted: false
      };
      
      expect(canSurrender(hand)).toBe(true);
    });

    it('should return false for busted hands', () => {
      const hand: Hand = {
        cards: [
          { suit: 'hearts', rank: 'K', value: 10, displayValue: 'K' },
          { suit: 'spades', rank: 'K', value: 10, displayValue: 'K' },
          { suit: 'clubs', rank: '5', value: 5, displayValue: '5' }
        ],
        total: 25,
        isSoft: false,
        isBlackjack: false,
        isBusted: true
      };
      
      expect(canSurrender(hand)).toBe(false);
    });
  });
});
