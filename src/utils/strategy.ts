import { PlayerAction, StrategyRecommendation } from '../types/game';
import { Hand, Card } from '../types/card';

/**
 * Basic strategy tables for optimal blackjack play
 */

// Hard totals strategy table [playerTotal][dealerUpcard]
const HARD_TOTALS_STRATEGY: (PlayerAction | 'H' | 'S')[][] = [
  // Dealer upcard: A, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 5
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 6
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 7
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 8
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 9
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 10
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 11
  ['H', 'H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H'], // 12
  ['H', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H'], // 13
  ['H', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H'], // 14
  ['H', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H'], // 15
  ['H', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H'], // 16
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 17
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 18
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 19
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // 20
];

// Soft totals strategy table [playerTotal][dealerUpcard]
// Note: Doubling is checked separately in getDoubleDownRecommendation
const SOFT_TOTALS_STRATEGY: (PlayerAction | 'H' | 'S')[][] = [
  // Dealer upcard: A, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,2 (13)
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,3 (14)
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,4 (15)
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,5 (16)
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // A,6 (17)
  ['H', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'H', 'H'], // A,7 (18) - Stand vs 2-8, Hit vs 9,10,A
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A,8 (19)
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A,9 (20)
  ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'], // A,10 (21 - Blackjack)
];

// Pairs strategy table [playerPair][dealerUpcard]
const PAIRS_STRATEGY: (PlayerAction | 'H' | 'S' | 'P')[][] = [
  // Dealer upcard: A, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // A,A
  ['H', 'P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H'], // 2,2
  ['H', 'P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H'], // 3,3
  ['H', 'H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H'], // 4,4
  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'], // 5,5
  ['H', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'], // 6,6
  ['H', 'P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H'], // 7,7
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // 8,8
  ['S', 'P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S'], // 9,9
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
  
  // Check for pairs first (except 5,5 which should be treated as hard 10)
  if (isPair(playerHand) && !(playerHand.cards[0].rank === '5')) {
    const pairIndex = getPairValue(playerHand);
    const action = PAIRS_STRATEGY[pairIndex][dealerIndex];
    
    if (action === 'P') {
      const pairRank = playerHand.cards[0].rank;
      return {
        action: 'split',
        confidence: 95,
        reasoning: `Splitting ${pairRank}s vs dealer ${dealerUpcard.rank} gives you two chances to improve and maximizes long-term profit`,
        expectedValue: 0.1,
      };
    } else if (action === 'H') {
      const pairRank = playerHand.cards[0].rank;
      return {
        action: 'hit',
        confidence: 90,
        reasoning: `Pair of ${pairRank}s vs dealer ${dealerUpcard.rank}. Splitting isn't optimal here - hitting gives you a better chance to improve`,
        expectedValue: 0.05,
      };
    } else if (action === 'S') {
      const pairRank = playerHand.cards[0].rank;
      return {
        action: 'stand',
        confidence: 90,
        reasoning: `Pair of ${pairRank}s vs dealer ${dealerUpcard.rank}. Standing is the best play here - don't risk busting`,
        expectedValue: 0.05,
      };
    }
  }
  
  // Special case: Pair of 5s should be treated as hard 10 for double down
  if (isPair(playerHand) && playerHand.cards[0].rank === '5') {
    // Pair of 5s should double down vs any dealer card
    return {
      action: 'double-down',
      confidence: 98,
      reasoning: `Pair of 5s vs dealer ${dealerUpcard.rank}. Treating as hard 10 - doubling down maximizes your advantage`,
      expectedValue: 0.15,
    };
  }
  
  // Check for blackjack first
  if (playerHand.isBlackjack) {
    return {
      action: 'stand',
      confidence: 100,
      reasoning: `Blackjack! You automatically win unless the dealer also has blackjack. No action needed - the game will resolve automatically.`,
      expectedValue: 1.5, // 3:2 payout
    };
  }
  
  // Check for soft totals
  if (isSoftTotal(playerHand)) {
    const softIndex = Math.min(playerHand.total - 13, SOFT_TOTALS_STRATEGY.length - 1);
    const action = SOFT_TOTALS_STRATEGY[softIndex][dealerIndex];
    
    if (action === 'H') {
      return {
        action: 'hit',
        confidence: 90,
        reasoning: `With soft ${playerHand.total} vs dealer ${dealerUpcard.rank}, you can't bust on the next card - taking another gives you a chance to improve`,
        expectedValue: 0.05,
      };
    } else {
      return {
        action: 'stand',
        confidence: 90,
        reasoning: `Soft ${playerHand.total} is strong enough vs dealer ${dealerUpcard.rank}. The dealer is likely to bust, so stand and let them play`,
        expectedValue: 0.05,
      };
    }
  }
  
  // Check hard totals
  const hardIndex = Math.min(playerHand.total - 5, HARD_TOTALS_STRATEGY.length - 1);
  
  // Ensure indices are within bounds
  if (hardIndex < 0 || hardIndex >= HARD_TOTALS_STRATEGY.length) {
    return {
      action: 'stand',
      confidence: 50,
      reasoning: `Invalid hand total: ${playerHand.total}`,
      expectedValue: 0,
    };
  }
  
  if (dealerIndex < 0 || dealerIndex >= HARD_TOTALS_STRATEGY[hardIndex].length) {
    return {
      action: 'stand',
      confidence: 50,
      reasoning: `Invalid dealer upcard: ${dealerUpcard.rank}`,
      expectedValue: 0,
    };
  }
  
  const action = HARD_TOTALS_STRATEGY[hardIndex][dealerIndex];
  
  if (action === 'H') {
    const dealerIsWeak = ['4', '5', '6'].includes(dealerUpcard.rank);
    const dealerIsStrong = ['10', 'J', 'Q', 'K', 'A'].includes(dealerUpcard.rank);
    
    if (playerHand.total <= 11) {
      return {
        action: 'hit',
        confidence: 95,
        reasoning: `With ${playerHand.total}, you can't bust. Always take another card to improve your hand`,
        expectedValue: 0.1,
      };
    } else if (dealerIsStrong) {
      return {
        action: 'hit',
        confidence: 95,
        reasoning: `Your ${playerHand.total} vs dealer ${dealerUpcard.rank} (strong card). You need to improve to compete with dealer's likely strong hand`,
        expectedValue: 0.1,
      };
    } else {
      return {
        action: 'hit',
        confidence: 95,
        reasoning: `Your ${playerHand.total} is too weak to stand. Take another card to try to reach 17+`,
        expectedValue: 0.1,
      };
    }
  } else {
    const dealerIsWeak = ['4', '5', '6'].includes(dealerUpcard.rank);
    
    if (playerHand.total >= 17) {
      return {
        action: 'stand',
        confidence: 95,
        reasoning: `${playerHand.total} is a strong total. Risk of busting is too high to hit - let the dealer play their hand`,
        expectedValue: 0.1,
      };
    } else if (dealerIsWeak) {
      return {
        action: 'stand',
        confidence: 95,
        reasoning: `Dealer shows ${dealerUpcard.rank} (weak card). Dealer must hit and is likely to bust, so stand and let them play`,
        expectedValue: 0.1,
      };
    } else {
      return {
        action: 'stand',
        confidence: 95,
        reasoning: `${playerHand.total} vs dealer ${dealerUpcard.rank}. Standing gives you the best chance to win without risking a bust`,
        expectedValue: 0.1,
      };
    }
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
  // Note: dealer values are INDICES (0=A, 1=2, 2=3, 3=4, 4=5, 5=6, 6=7, 7=8, 8=9, 9=10)
  const hardDoubleDowns = [
    [9, 2, 3, 4, 5], // 9 vs 3-6 (indices 2,3,4,5)
    [10, 1, 2, 3, 4, 5, 6, 7, 8], // 10 vs 2-9 (indices 1-8)
    [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // 11 vs A-10 (indices 0-9)
  ];
  
  // Soft totals that should double down
  // Note: dealer values are INDICES (0=A, 1=2, 2=3, 3=4, 4=5, 5=6, 6=7, 7=8, 8=9, 9=10)
  const softDoubleDowns = [
    [17, 2, 3, 4, 5], // A,6 vs 3-6 (indices 2,3,4,5)
    [18, 2, 3, 4, 5], // A,7 vs 3-6 (indices 2,3,4,5)
    [19, 5], // A,8 vs 6 (index 5)
  ];
  
  // Check hard totals (only if hand is NOT soft)
  if (!playerHand.isSoft) {
    for (const [total, ...dealerValues] of hardDoubleDowns) {
      if (playerTotal === total && dealerValues.includes(dealerValue)) {
        const dealerIsWeak = ['4', '5', '6'].includes(dealerUpcard.rank);
        let reasoning = '';
        
        if (total === 11) {
          reasoning = `${total} is the best doubling hand. Dealer shows ${dealerUpcard.rank} - double your bet to maximize profit when you're favored`;
        } else if (total === 10) {
          reasoning = `${total} vs dealer ${dealerUpcard.rank} is a strong position. Many cards improve your hand - double to maximize profit`;
        } else {
          reasoning = `${total} vs weak dealer ${dealerUpcard.rank}. Dealer is likely to bust - double your bet to capitalize on their weakness`;
        }
        
        return {
          action: 'double-down',
          confidence: 98, // Higher than basic hit/stand to prioritize doubling when applicable
          reasoning,
          expectedValue: 0.2,
        };
      }
    }
  }
  
  // Check soft totals (only if hand IS soft)
  if (playerHand.isSoft) {
    for (const [total, ...dealerValues] of softDoubleDowns) {
      if (playerTotal === total && dealerValues.includes(dealerValue)) {
        return {
          action: 'double-down',
          confidence: 96, // Higher than basic hit/stand to prioritize doubling when applicable
          reasoning: `Soft ${total} vs dealer ${dealerUpcard.rank}. You can't bust with one card - double to maximize profit against the dealer's weak position`,
          expectedValue: 0.15,
        };
      }
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
    reasoning: 'Insurance is a bad bet. The house edge is too high - you lose money over time even when dealer has blackjack occasionally',
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
        reasoning: `${total} vs dealer ${dealerUpcard.rank} is a very weak position. Surrendering saves half your bet compared to the likely loss if you play`,
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
