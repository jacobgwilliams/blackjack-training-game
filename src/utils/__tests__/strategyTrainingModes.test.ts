import { renderHook } from '@testing-library/react';
import { useBlackjackStrategy } from '../../hooks/useBlackjackStrategy';
import { Hand, Card } from '../../types/card';
import { DebugScenario } from '../../types/game';

/**
 * Tests strategy recommendations with different training modes
 * 
 * This validates that:
 * 1. Training mode context is correctly applied
 * 2. Training notes are added when recommendations don't match expected action
 * 3. All training modes work correctly
 */

describe('Strategy Training Modes', () => {
  // Helper function to create a card
  function createCard(rank: string, suit: string = 'hearts'): Card {
    return {
      suit: suit as any,
      rank: rank as any,
      value: rank === 'A' ? 11 : (['J', 'Q', 'K'].includes(rank) ? 10 : parseInt(rank)),
      displayValue: rank,
    };
  }

  // Helper function to create a hand
  function createHand(cards: Card[]): Hand {
    let total = 0;
    let aces = 0;
    let isSoft = false;

    // Calculate total
    for (const card of cards) {
      if (card.rank === 'A') {
        aces++;
        total += 11;
      } else {
        total += card.value;
      }
    }

    // Adjust for aces
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    isSoft = aces > 0 && total <= 21;

    return {
      cards,
      total,
      isSoft,
      isBlackjack: cards.length === 2 && total === 21,
      isBusted: total > 21,
    };
  }

  describe('Double Down Practice Mode', () => {
    it('should recommend double down for 11 vs dealer 6', () => {
      const playerHand = createHand([
        createCard('5'),
        createCard('6')
      ]);
      const dealerUpcard = createCard('6');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'double-down')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('double-down');
      expect(result.current.primaryRecommendation?.reasoning).toContain('double');
    });

    it('should add training note when best action is not double down', () => {
      const playerHand = createHand([
        createCard('10'),
        createCard('8') // 18 - should stand, not double
      ]);
      const dealerUpcard = createCard('7');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'double-down')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('stand');
      expect(result.current.primaryRecommendation?.reasoning).toContain('Training Note');
      expect(result.current.primaryRecommendation?.reasoning).toContain('DOUBLE DOWN opportunity');
    });
  });

  describe('Hit Practice Mode', () => {
    it('should recommend hit for 14 vs dealer 10', () => {
      const playerHand = createHand([
        createCard('10'),
        createCard('4')
      ]);
      const dealerUpcard = createCard('10');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'hit')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('hit');
      expect(result.current.primaryRecommendation?.reasoning).toContain('hit');
    });

    it('should add training note when best action is not hit', () => {
      const playerHand = createHand([
        createCard('10'),
        createCard('8') // 18 - should stand, not hit
      ]);
      const dealerUpcard = createCard('7');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'hit')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('stand');
      expect(result.current.primaryRecommendation?.reasoning).toContain('Training Note');
      expect(result.current.primaryRecommendation?.reasoning).toContain('HIT opportunity');
    });
  });

  describe('Stand Practice Mode', () => {
    it('should recommend stand for 18 vs dealer 7', () => {
      const playerHand = createHand([
        createCard('10'),
        createCard('8')
      ]);
      const dealerUpcard = createCard('7');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'stand')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('stand');
      expect(result.current.primaryRecommendation?.reasoning).toContain('stand');
    });

    it('should add training note when best action is not stand', () => {
      const playerHand = createHand([
        createCard('5'),
        createCard('6') // 11 - should double, not stand
      ]);
      const dealerUpcard = createCard('6');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'stand')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('double-down');
      expect(result.current.primaryRecommendation?.reasoning).toContain('Training Note');
      expect(result.current.primaryRecommendation?.reasoning).toContain('STAND opportunity');
    });
  });

  describe('Split Practice Mode', () => {
    it('should recommend split for 8,8 vs dealer 5', () => {
      const playerHand = createHand([
        createCard('8', 'hearts'),
        createCard('8', 'diamonds')
      ]);
      const dealerUpcard = createCard('5');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'split')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('split');
      expect(result.current.primaryRecommendation?.reasoning).toContain('split');
    });

    it('should add training note when best action is not split', () => {
      const playerHand = createHand([
        createCard('10'),
        createCard('8') // 18 - should stand, not split
      ]);
      const dealerUpcard = createCard('7');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'split')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('stand');
      expect(result.current.primaryRecommendation?.reasoning).toContain('Training Note');
      expect(result.current.primaryRecommendation?.reasoning).toContain('SPLIT opportunity');
    });
  });

  describe('Normal Play Mode', () => {
    it('should not add training notes in normal mode', () => {
      const playerHand = createHand([
        createCard('10'),
        createCard('8')
      ]);
      const dealerUpcard = createCard('7');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'none')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('stand');
      expect(result.current.primaryRecommendation?.reasoning).not.toContain('Training Note');
    });
  });

  describe('Edge Cases with Training Modes', () => {
    it('should handle soft hands correctly in double down mode', () => {
      const playerHand = createHand([
        createCard('A'),
        createCard('6') // Soft 17
      ]);
      const dealerUpcard = createCard('6');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'double-down')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('double-down');
      expect(result.current.primaryRecommendation?.reasoning).toContain('soft');
    });

    it('should handle pairs correctly in split mode', () => {
      const playerHand = createHand([
        createCard('A', 'hearts'),
        createCard('A', 'diamonds')
      ]);
      const dealerUpcard = createCard('6');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'split')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('split');
      expect(result.current.primaryRecommendation?.reasoning).toContain('Aces');
    });

    it('should handle blackjack correctly in any mode', () => {
      const playerHand = createHand([
        createCard('A'),
        createCard('10')
      ]);
      const dealerUpcard = createCard('6');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'hit')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('stand');
      expect(result.current.primaryRecommendation?.reasoning).not.toContain('Training Note');
    });
  });
});
