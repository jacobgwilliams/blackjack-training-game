import { getAllStrategyRecommendations } from '../strategy';
import { Hand, Card } from '../../types/card';
import { DebugScenario } from '../../types/game';
import { useBlackjackStrategy } from '../../hooks/useBlackjackStrategy';
import { renderHook } from '@testing-library/react';

/**
 * Manual validation of strategy recommendations
 * 
 * This test demonstrates the process of validating each scenario:
 * 1. Generate scenario
 * 2. Get strategy recommendation
 * 3. Validate the logic is correct
 * 4. Create test assertion
 * 5. Fix bugs if found
 */

describe('Strategy Validation Process', () => {
  // Helper functions
  function createCard(rank: string, suit: string = 'hearts'): Card {
    return {
      suit: suit as any,
      rank: rank as any,
      value: rank === 'A' ? 11 : (['J', 'Q', 'K'].includes(rank) ? 10 : parseInt(rank)),
      displayValue: rank,
    };
  }

  function createHand(cards: Card[]): Hand {
    let total = 0;
    let aces = 0;
    let isSoft = false;

    for (const card of cards) {
      if (card.rank === 'A') {
        aces++;
        total += 11;
      } else {
        total += card.value;
      }
    }

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

  describe('Sample Validation - Hard Totals', () => {
    // Let's manually validate a few key scenarios
    const testCases = [
      {
        name: 'Hard 11 vs Dealer 6 (Should Double)',
        cards: ['5', '6'],
        dealer: '6',
        expectedAction: 'double-down',
        expectedReasoning: 'double'
      },
      {
        name: 'Hard 16 vs Dealer 10 (Should Hit)',
        cards: ['10', '6'],
        dealer: '10',
        expectedAction: 'hit',
        expectedReasoning: 'hit'
      },
      {
        name: 'Hard 17 vs Dealer 7 (Should Stand)',
        cards: ['10', '7'],
        dealer: '7',
        expectedAction: 'stand',
        expectedReasoning: 'stand'
      },
      {
        name: 'Hard 12 vs Dealer 4 (Should Stand)',
        cards: ['10', '2'],
        dealer: '4',
        expectedAction: 'stand',
        expectedReasoning: 'stand'
      },
      {
        name: 'Hard 12 vs Dealer 7 (Should Hit)',
        cards: ['10', '2'],
        dealer: '7',
        expectedAction: 'hit',
        expectedReasoning: 'hit'
      }
    ];

    testCases.forEach(({ name, cards, dealer, expectedAction, expectedReasoning }) => {
      it(`should correctly handle: ${name}`, () => {
        const playerHand = createHand([
          createCard(cards[0]),
          createCard(cards[1])
        ]);
        const dealerUpcard = createCard(dealer);

        const recommendations = getAllStrategyRecommendations(playerHand, dealerUpcard);
        const primaryRecommendation = recommendations.reduce((best, current) => 
          current.confidence > best.confidence ? current : best
        );

        // Log the actual recommendation for debugging
        console.log(`\n${name}:`);
        console.log(`  Expected Action: ${expectedAction}`);
        console.log(`  Actual Action: ${primaryRecommendation.action}`);
        console.log(`  Confidence: ${primaryRecommendation.confidence}%`);
        console.log(`  Reasoning: ${primaryRecommendation.reasoning}`);
        
        // Validate the recommendation
        expect(primaryRecommendation.action).toBe(expectedAction);
        expect(primaryRecommendation.confidence).toBeGreaterThan(80);
      });
    });
  });

  describe('Sample Validation - Soft Totals', () => {
    const testCases = [
      {
        name: 'Soft 17 vs Dealer 6 (Should Double)',
        cards: ['A', '6'],
        dealer: '6',
        expectedAction: 'double-down',
        expectedReasoning: 'double'
      },
      {
        name: 'Soft 18 vs Dealer 7 (Should Stand)',
        cards: ['A', '7'],
        dealer: '7',
        expectedAction: 'stand',
        expectedReasoning: 'stand'
      },
      {
        name: 'Soft 18 vs Dealer 9 (Should Hit)',
        cards: ['A', '7'],
        dealer: '9',
        expectedAction: 'hit',
        expectedReasoning: 'hit'
      }
    ];

    testCases.forEach(({ name, cards, dealer, expectedAction, expectedReasoning }) => {
      it(`should correctly handle: ${name}`, () => {
        const playerHand = createHand([
          createCard(cards[0]),
          createCard(cards[1])
        ]);
        const dealerUpcard = createCard(dealer);

        const recommendations = getAllStrategyRecommendations(playerHand, dealerUpcard);
        const primaryRecommendation = recommendations.reduce((best, current) => 
          current.confidence > best.confidence ? current : best
        );

        // Log the actual recommendation for debugging
        console.log(`\n${name}:`);
        console.log(`  Expected Action: ${expectedAction}`);
        console.log(`  Actual Action: ${primaryRecommendation.action}`);
        console.log(`  Confidence: ${primaryRecommendation.confidence}%`);
        console.log(`  Reasoning: ${primaryRecommendation.reasoning}`);
        
        // Validate the recommendation
        expect(primaryRecommendation.action).toBe(expectedAction);
        expect(primaryRecommendation.confidence).toBeGreaterThan(80);
      });
    });
  });

  describe('Sample Validation - Pairs', () => {
    const testCases = [
      {
        name: 'Pair of 8s vs Dealer 5 (Should Split)',
        cards: ['8', '8'],
        dealer: '5',
        expectedAction: 'split',
        expectedReasoning: 'split'
      },
      {
        name: 'Pair of 10s vs Dealer 6 (Should Stand)',
        cards: ['10', '10'],
        dealer: '6',
        expectedAction: 'stand',
        expectedReasoning: 'stand'
      },
      {
        name: 'Pair of Aces vs Dealer 7 (Should Split)',
        cards: ['A', 'A'],
        dealer: '7',
        expectedAction: 'split',
        expectedReasoning: 'split'
      }
    ];

    testCases.forEach(({ name, cards, dealer, expectedAction, expectedReasoning }) => {
      it(`should correctly handle: ${name}`, () => {
        const playerHand = createHand([
          createCard(cards[0], 'hearts'),
          createCard(cards[1], 'diamonds')
        ]);
        const dealerUpcard = createCard(dealer);

        const recommendations = getAllStrategyRecommendations(playerHand, dealerUpcard);
        const primaryRecommendation = recommendations.reduce((best, current) => 
          current.confidence > best.confidence ? current : best
        );

        // Log the actual recommendation for debugging
        console.log(`\n${name}:`);
        console.log(`  Expected Action: ${expectedAction}`);
        console.log(`  Actual Action: ${primaryRecommendation.action}`);
        console.log(`  Confidence: ${primaryRecommendation.confidence}%`);
        console.log(`  Reasoning: ${primaryRecommendation.reasoning}`);
        
        // Validate the recommendation
        expect(primaryRecommendation.action).toBe(expectedAction);
        expect(primaryRecommendation.confidence).toBeGreaterThan(80);
      });
    });
  });

  describe('Sample Validation - Training Modes', () => {
    it('should provide training context for mismatched scenarios', () => {
      // Test a scenario where training mode doesn't match optimal action
      const playerHand = createHand([
        createCard('10'),
        createCard('8') // 18 - should stand
      ]);
      const dealerUpcard = createCard('7');

      const { result } = renderHook(() => 
        useBlackjackStrategy(playerHand, dealerUpcard, 'hit')
      );

      expect(result.current.primaryRecommendation).toBeTruthy();
      expect(result.current.primaryRecommendation?.action).toBe('stand');
      expect(result.current.primaryRecommendation?.reasoning).toContain('Training Note');
      
      console.log(`\nTraining Mode Test (18 vs 7 in Hit mode):`);
      console.log(`  Action: ${result.current.primaryRecommendation?.action}`);
      console.log(`  Reasoning: ${result.current.primaryRecommendation?.reasoning}`);
    });
  });
});
