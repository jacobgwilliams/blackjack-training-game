import { Card, Hand, Suit, Rank } from '../types/card';
import { getBasicStrategyRecommendation } from './strategy';

export interface DrillScenario {
  playerHand: Hand;
  dealerUpcard: Card;
  correctAction: string;
  explanation: string;
  category: 'hard-total' | 'soft-total' | 'pair' | 'blackjack';
}

// All possible ranks and suits
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

// Helper function to get card value
const getCardValue = (rank: Rank): number => {
  if (rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank);
};

// Helper function to get display value
const getDisplayValue = (rank: Rank): string => {
  return rank;
};

// Create a card object
const createCard = (rank: Rank, suit: Suit): Card => ({
  rank,
  suit,
  value: getCardValue(rank),
  displayValue: getDisplayValue(rank)
});

// Calculate hand total and properties
const calculateHand = (cards: Card[]): Omit<Hand, 'cards'> => {
  let total = 0;
  let aces = 0;
  let isSoft = false;

  // First pass: count all cards
  for (const card of cards) {
    if (card.rank === 'A') {
      aces++;
      total += 11;
    } else {
      total += card.value;
    }
  }

  // Second pass: adjust for aces if needed
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  isSoft = aces > 0 && total <= 21;

  return {
    total,
    isSoft,
    isBlackjack: cards.length === 2 && total === 21,
    isBusted: total > 21
  };
};

// Generate a random card
const getRandomCard = (): Card => {
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  return createCard(rank, suit);
};

// Generate scenarios for hard totals (5-20)
const generateHardTotalScenarios = (): DrillScenario[] => {
  const scenarios: DrillScenario[] = [];
  
  // Generate scenarios for each hard total (5-20)
  for (let total = 5; total <= 20; total++) {
    // Generate multiple scenarios for each total
    for (let i = 0; i < 3; i++) {
      const cards = generateCardsForTotal(total, false);
      if (cards.length >= 2) {
        const hand: Hand = {
          cards,
          ...calculateHand(cards)
        };
        
        // Generate dealer upcard
        const dealerUpcard = getRandomCard();
        
        // Get strategy recommendation
        const recommendation = getBasicStrategyRecommendation(hand, dealerUpcard);
        
        scenarios.push({
          playerHand: hand,
          dealerUpcard,
          correctAction: recommendation.action,
          explanation: recommendation.reasoning,
          category: 'hard-total'
        });
      }
    }
  }
  
  return scenarios;
};

// Generate scenarios for soft totals (A,2 through A,9)
const generateSoftTotalScenarios = (): DrillScenario[] => {
  const scenarios: DrillScenario[] = [];
  
  // Generate scenarios for each soft total
  for (let secondCard = 2; secondCard <= 9; secondCard++) {
    for (let i = 0; i < 2; i++) {
      const aceCard = createCard('A', SUITS[Math.floor(Math.random() * SUITS.length)]);
      const secondCardRank = secondCard.toString() as Rank;
      const secondCardSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
      const secondCardObj = createCard(secondCardRank, secondCardSuit);
      
      const hand: Hand = {
        cards: [aceCard, secondCardObj],
        ...calculateHand([aceCard, secondCardObj])
      };
      
      // Generate dealer upcard
      const dealerUpcard = getRandomCard();
      
      // Get strategy recommendation
      const recommendation = getBasicStrategyRecommendation(hand, dealerUpcard);
      
      scenarios.push({
        playerHand: hand,
        dealerUpcard,
        correctAction: recommendation.action,
        explanation: recommendation.reasoning,
        category: 'soft-total'
      });
    }
  }
  
  return scenarios;
};

// Generate scenarios for pairs
const generatePairScenarios = (): DrillScenario[] => {
  const scenarios: DrillScenario[] = [];
  
  // Generate scenarios for each pair (2-10, A, J, Q, K)
  const pairRanks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'Q', 'K'];
  
  for (const rank of pairRanks) {
    for (let i = 0; i < 2; i++) {
      const suit1 = SUITS[Math.floor(Math.random() * SUITS.length)];
      const suit2 = SUITS[Math.floor(Math.random() * SUITS.length)];
      
      const card1 = createCard(rank, suit1);
      const card2 = createCard(rank, suit2);
      
      const hand: Hand = {
        cards: [card1, card2],
        ...calculateHand([card1, card2])
      };
      
      // Generate dealer upcard
      const dealerUpcard = getRandomCard();
      
      // Get strategy recommendation
      const recommendation = getBasicStrategyRecommendation(hand, dealerUpcard);
      
      scenarios.push({
        playerHand: hand,
        dealerUpcard,
        correctAction: recommendation.action,
        explanation: recommendation.reasoning,
        category: 'pair'
      });
    }
  }
  
  return scenarios;
};

// Generate blackjack scenarios
const generateBlackjackScenarios = (): DrillScenario[] => {
  const scenarios: DrillScenario[] = [];
  
  // Generate blackjack scenarios (A + 10-value card)
  const tenValueRanks: Rank[] = ['10', 'J', 'Q', 'K'];
  
  for (const tenRank of tenValueRanks) {
    const aceCard = createCard('A', SUITS[Math.floor(Math.random() * SUITS.length)]);
    const tenCard = createCard(tenRank, SUITS[Math.floor(Math.random() * SUITS.length)]);
    
    const hand: Hand = {
      cards: [aceCard, tenCard],
      ...calculateHand([aceCard, tenCard])
    };
    
    // Generate dealer upcard
    const dealerUpcard = getRandomCard();
    
    // Get strategy recommendation
    const recommendation = getBasicStrategyRecommendation(hand, dealerUpcard);
    
    scenarios.push({
      playerHand: hand,
      dealerUpcard,
      correctAction: recommendation.action,
      explanation: recommendation.reasoning,
      category: 'blackjack'
    });
  }
  
  return scenarios;
};

// Helper function to generate cards that add up to a specific total
const generateCardsForTotal = (targetTotal: number, isSoft: boolean): Card[] => {
  const cards: Card[] = [];
  let currentTotal = 0;
  
  if (isSoft) {
    // For soft hands, start with an Ace
    const ace = createCard('A', SUITS[Math.floor(Math.random() * SUITS.length)]);
    cards.push(ace);
    currentTotal = 11;
  }
  
  // Add cards until we reach the target
  while (currentTotal < targetTotal && cards.length < 5) {
    const remaining = targetTotal - currentTotal;
    let nextCard: Card;
    
    if (remaining <= 1) {
      // Need to add a card that makes the total go over, then adjust
      nextCard = getRandomCard();
    } else if (remaining <= 10) {
      // Try to find a card that gets us close
      const possibleRanks = RANKS.filter(rank => {
        const value = getCardValue(rank);
        return value <= remaining;
      });
      
      if (possibleRanks.length > 0) {
        const rank = possibleRanks[Math.floor(Math.random() * possibleRanks.length)];
        nextCard = createCard(rank, SUITS[Math.floor(Math.random() * SUITS.length)]);
      } else {
        nextCard = getRandomCard();
      }
    } else {
      // Just add a random card
      nextCard = getRandomCard();
    }
    
    cards.push(nextCard);
    currentTotal += nextCard.value;
    
    // Adjust for aces if we go over 21
    let aces = cards.filter(c => c.rank === 'A').length;
    while (currentTotal > 21 && aces > 0) {
      currentTotal -= 10;
      aces--;
    }
  }
  
  // If we didn't hit the target exactly, try to adjust
  if (currentTotal !== targetTotal) {
    // For now, just return what we have
    // In a more sophisticated version, we could try to adjust
  }
  
  return cards;
};

// Main function to generate all scenarios
export const generateAllScenarios = (): DrillScenario[] => {
  const scenarios: DrillScenario[] = [];
  
  // Generate scenarios from each category
  scenarios.push(...generateHardTotalScenarios());
  scenarios.push(...generateSoftTotalScenarios());
  scenarios.push(...generatePairScenarios());
  scenarios.push(...generateBlackjackScenarios());
  
  // Remove duplicates and filter out invalid scenarios
  const uniqueScenarios = scenarios.filter((scenario, index, self) => {
    // Remove scenarios with busted hands
    if (scenario.playerHand.isBusted) return false;
    
    // Remove scenarios where the action is not one of our options
    const validActions = ['hit', 'stand', 'double-down', 'split'];
    if (!validActions.includes(scenario.correctAction)) return false;
    
    // Remove exact duplicates
    const key = `${scenario.playerHand.total}-${scenario.playerHand.isSoft}-${scenario.dealerUpcard.rank}`;
    return index === self.findIndex(s => 
      `${s.playerHand.total}-${s.playerHand.isSoft}-${s.dealerUpcard.rank}` === key
    );
  });
  
  return uniqueScenarios;
};

// Function to get a random scenario
export const getRandomScenario = (scenarios: DrillScenario[]): DrillScenario => {
  return scenarios[Math.floor(Math.random() * scenarios.length)];
};

// Function to get scenarios by category
export const getScenariosByCategory = (scenarios: DrillScenario[], category: DrillScenario['category']): DrillScenario[] => {
  return scenarios.filter(scenario => scenario.category === category);
};
