import { PlayerAction, StrategyRecommendation } from '../types/game';
import { Hand, Card } from '../types/card';

/**
 * Basic strategy tables for optimal blackjack play
 */

// Hard totals strategy table [playerTotal][dealerUpcard]
const HARD_TOTALS_STRATEGY: (PlayerAction | 'H' | 'S')[][] = [
  // Dealer upcard: A, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 5-8
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 9
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 10
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 11
  ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'], // 12
  ['H', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'], // 13
  ['H', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'], // 14
  ['H', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'], // 15
  ['H', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'], // 16
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 17
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 18
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 19
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 20
];

// Soft totals strategy table [playerTotal][dealerUpcard]
const SOFT_TOTALS_STRATEGY: (PlayerAction | 'H' | 'S')[][] = [
  // Dealer upcard: A, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,2
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,3
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,4
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,5
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,6
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,7
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,8
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,9
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A,10
];

// Pairs strategy table [playerPair][dealerUpcard]
const PAIRS_STRATEGY: (PlayerAction | 'H' | 'S' | 'P')[][] = [
  // Dealer upcard: A, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // A,A
  ['H', 'P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H'], // 2,2
  ['H', 'P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H'], // 3,3
  ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'], // 4,4
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 5,5
  ['H', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'], // 6,6
  ['H', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'], // 7,7
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // 8,8
  ['S', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'], // 9,9
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 10,10
];

/**
 * Gets the dealer's upcard value for strategy lookup
 */
function getDealerUpcardValue(dealerUpcard: Card): number {
  if (dealerUpcard.rank === 'A') return 0; // Ace is index 0
  if (dealerUpcard.rank === '10' || dealerUpcard.rank === 'J' || 
      dealerUpcard.rank === 'Q' || dealerUpcard.rank === 'K') {
    return 9; // 10-value cards are index 9
  }
  return parseInt(dealerUpcard.rank) - 1; // 2-9 are indices 1-8
}

/**
 * Gets the player's hand total for strategy lookup
 */
function getPlayerHandTotal(hand: Hand): number {
  return hand.total;
}

/**
 * Checks if the hand is a soft total
 */
function isSoftTotal(hand: Hand): boolean {
  return hand.isSoft;
}

/**
 * Checks if the hand is a pair
 */
function isPair(hand: Hand): boolean {
  return hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank;
}

/**
 * Gets the pair value for strategy lookup
 */
function getPairValue(hand: Hand): number {
  if (!isPair(hand)) return -1;
  
  const rank = hand.cards[0].rank;
  if (rank === 'A') return 0;
  if (rank === '10' || rank === 'J' || rank === 'Q' || rank === 'K') return 9;
  return parseInt(rank) - 1;
}

/**
 * Gets the basic strategy recommendation for a given situation
 */
export function getBasicStrategyRecommendation(
  playerHand: Hand,
  dealerUpcard: Card
): StrategyRecommendation {
  const dealerIndex = getDealerUpcardValue(dealerUpcard);
  
  // Check for pairs first
  if (isPair(playerHand)) {
    const pairIndex = getPairValue(playerHand);
    const action = PAIRS_STRATEGY[pairIndex][dealerIndex];
    
    if (action === 'P') {
      return {
        action: 'split',
        confidence: 95,
        reasoning: 'Basic strategy recommends splitting this pair',
        expectedValue: 0.1,
      };
    }
  }
  
  // Check for soft totals
  if (isSoftTotal(playerHand)) {
    const softIndex = Math.min(playerHand.total - 12, SOFT_TOTALS_STRATEGY.length - 1);
    const action = SOFT_TOTALS_STRATEGY[softIndex][dealerIndex];
    
    if (action === 'H') {
      return {
        action: 'hit',
        confidence: 90,
        reasoning: 'Basic strategy recommends hitting with this soft total',
        expectedValue: 0.05,
      };
    } else {
      return {
        action: 'stand',
        confidence: 90,
        reasoning: 'Basic strategy recommends standing with this soft total',
        expectedValue: 0.05,
      };
    }
  }
  
  // Check hard totals
  const hardIndex = Math.min(playerHand.total - 5, HARD_TOTALS_STRATEGY.length - 1);
  const action = HARD_TOTALS_STRATEGY[hardIndex][dealerIndex];
  
  if (action === 'H') {
    return {
      action: 'hit',
      confidence: 95,
      reasoning: 'Basic strategy recommends hitting with this hard total',
      expectedValue: 0.1,
    };
  } else {
    return {
      action: 'stand',
      confidence: 95,
      reasoning: 'Basic strategy recommends standing with this hard total',
      expectedValue: 0.1,
    };
  }
}

/**
 * Gets the optimal action for doubling down
 */
export function getDoubleDownRecommendation(
  playerHand: Hand,
  dealerUpcard: Card
): StrategyRecommendation | null {
  // Can only double down on first two cards
  if (playerHand.cards.length !== 2) {
    return null;
  }
  
  const playerTotal = playerHand.total;
  const dealerValue = getDealerUpcardValue(dealerUpcard);
  
  // Hard totals that should double down
  const hardDoubleDowns = [
    [9, 3, 4, 5, 6], // 9 vs 3-6
    [10, 2, 3, 4, 5, 6, 7, 8, 9], // 10 vs 2-9
    [11, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 11 vs 2-10
  ];
  
  // Soft totals that should double down
  const softDoubleDowns = [
    [13, 5, 6], // A,2 vs 5-6
    [14, 5, 6], // A,3 vs 5-6
    [15, 4, 5, 6], // A,4 vs 4-6
    [16, 4, 5, 6], // A,5 vs 4-6
    [17, 3, 4, 5, 6], // A,6 vs 3-6
    [18, 2, 3, 4, 5, 6], // A,7 vs 2-6
  ];
  
  // Check hard totals
  for (const [total, ...dealerValues] of hardDoubleDowns) {
    if (playerTotal === total && dealerValues.includes(dealerValue)) {
      return {
        action: 'double-down',
        confidence: 90,
        reasoning: `Basic strategy recommends doubling down on ${playerTotal} vs dealer ${dealerUpcard.rank}`,
        expectedValue: 0.2,
      };
    }
  }
  
  // Check soft totals
  for (const [total, ...dealerValues] of softDoubleDowns) {
    if (playerTotal === total && dealerValues.includes(dealerValue)) {
      return {
        action: 'double-down',
        confidence: 85,
        reasoning: `Basic strategy recommends doubling down on soft ${playerTotal} vs dealer ${dealerUpcard.rank}`,
        expectedValue: 0.15,
      };
    }
  }
  
  return null;
}

/**
 * Gets the insurance recommendation
 */
export function getInsuranceRecommendation(): StrategyRecommendation {
  return {
    action: 'insurance',
    confidence: 0,
    reasoning: 'Basic strategy recommends never taking insurance',
    expectedValue: -0.1,
  };
}

/**
 * Gets the surrender recommendation
 */
export function getSurrenderRecommendation(
  playerHand: Hand,
  dealerUpcard: Card
): StrategyRecommendation | null {
  if (playerHand.cards.length !== 2) {
    return null;
  }
  
  const playerTotal = playerHand.total;
  const dealerValue = getDealerUpcardValue(dealerUpcard);
  
  // Hands that should surrender
  const surrenderHands = [
    [16, 9, 10], // 16 vs 9, 10
    [15, 10], // 15 vs 10
  ];
  
  for (const [total, ...dealerValues] of surrenderHands) {
    if (playerTotal === total && dealerValues.includes(dealerValue)) {
      return {
        action: 'surrender',
        confidence: 80,
        reasoning: `Basic strategy recommends surrendering ${playerTotal} vs dealer ${dealerUpcard.rank}`,
        expectedValue: -0.5,
      };
    }
  }
  
  return null;
}

/**
 * Gets all available strategy recommendations for a hand
 */
export function getAllStrategyRecommendations(
  playerHand: Hand,
  dealerUpcard: Card
): StrategyRecommendation[] {
  const recommendations: StrategyRecommendation[] = [];
  
  // Basic hit/stand recommendation
  recommendations.push(getBasicStrategyRecommendation(playerHand, dealerUpcard));
  
  // Double down recommendation
  const doubleDownRec = getDoubleDownRecommendation(playerHand, dealerUpcard);
  if (doubleDownRec) {
    recommendations.push(doubleDownRec);
  }
  
  // Surrender recommendation
  const surrenderRec = getSurrenderRecommendation(playerHand, dealerUpcard);
  if (surrenderRec) {
    recommendations.push(surrenderRec);
  }
  
  // Insurance recommendation (only if dealer shows Ace)
  if (dealerUpcard.rank === 'A') {
    recommendations.push(getInsuranceRecommendation());
  }
  
  return recommendations;
}
