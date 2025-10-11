import { GameState, GameResult, PlayerAction, GamePhase } from '../types/game';
import { Hand, Card } from '../types/card';
import { dealCard, addCardToHand, createEmptyHand, canSplitHand, canDoubleDown, canSurrender } from './cardUtils';

/**
 * Initializes a new game state
 */
export function initializeGame(deck: Card[], startingBalance: number): GameState {
  return {
    phase: 'betting',
    deck,
    playerHand: createEmptyHand(),
    dealerHand: createEmptyHand(),
    playerScore: startingBalance,
    currentBet: 0,
    canDoubleDown: false,
    canSplit: false,
    canSurrender: false,
    canTakeInsurance: false,
    result: null,
    isGameActive: false,
  };
}

/**
 * Places a bet and starts the game
 */
export function placeBet(gameState: GameState, betAmount: number): GameState {
  if (gameState.phase !== 'betting') {
    throw new Error('Can only place bets during betting phase');
  }
  
  if (betAmount > gameState.playerScore) {
    throw new Error('Insufficient funds');
  }
  
  return {
    ...gameState,
    currentBet: betAmount,
    playerScore: gameState.playerScore - betAmount,
    phase: 'dealing',
    isGameActive: true,
  };
}

/**
 * Deals initial cards to player and dealer
 */
export function dealInitialCards(gameState: GameState): GameState {
  let newDeck = gameState.deck;
  let playerHand = gameState.playerHand;
  let dealerHand = gameState.dealerHand;
  
  // Deal two cards to player
  for (let i = 0; i < 2; i++) {
    const { card, remainingDeck } = dealCard(newDeck);
    newDeck = remainingDeck;
    playerHand = addCardToHand(playerHand, card);
  }
  
  // Deal two cards to dealer
  for (let i = 0; i < 2; i++) {
    const { card, remainingDeck } = dealCard(newDeck);
    newDeck = remainingDeck;
    dealerHand = addCardToHand(dealerHand, card);
  }
  
  const canDouble = canDoubleDown(playerHand);
  const canSplit = canSplitHand(playerHand);
  const canSurr = canSurrender(playerHand);
  const canInsurance = dealerHand.cards[0].rank === 'A';
  
  return {
    ...gameState,
    deck: newDeck,
    playerHand,
    dealerHand,
    canDoubleDown: canDouble,
    canSplit,
    canSurrender: canSurr,
    canTakeInsurance: canInsurance,
    phase: 'player-turn',
  };
}

/**
 * Executes a player action
 */
export function executePlayerAction(
  gameState: GameState,
  action: PlayerAction
): GameState {
  switch (action) {
    case 'hit':
      return hitPlayer(gameState);
    case 'stand':
      return standPlayer(gameState);
    case 'double-down':
      return doubleDown(gameState);
    case 'split':
      return splitHand(gameState);
    case 'surrender':
      return surrender(gameState);
    case 'insurance':
      return takeInsurance(gameState);
    default:
      return gameState;
  }
}

/**
 * Player hits (takes another card)
 */
function hitPlayer(gameState: GameState): GameState {
  const { card, remainingDeck } = dealCard(gameState.deck);
  const newPlayerHand = addCardToHand(gameState.playerHand, card);
  
  let newPhase: GamePhase = 'player-turn';
  let result: GameResult | null = null;
  
  if (newPlayerHand.isBusted) {
    newPhase = 'game-over';
    result = 'dealer-wins';
  }
  
  return {
    ...gameState,
    deck: remainingDeck,
    playerHand: newPlayerHand,
    canDoubleDown: false,
    canSplit: false,
    canSurrender: false,
    phase: newPhase,
    result,
  };
}

/**
 * Player stands (ends their turn)
 */
function standPlayer(gameState: GameState): GameState {
  return {
    ...gameState,
    phase: 'dealer-turn',
  };
}

/**
 * Player doubles down
 */
function doubleDown(gameState: GameState): GameState {
  if (!gameState.canDoubleDown) {
    throw new Error('Cannot double down');
  }
  
  const { card, remainingDeck } = dealCard(gameState.deck);
  const newPlayerHand = addCardToHand(gameState.playerHand, card);
  
  const newBet = gameState.currentBet * 2;
  const newScore = gameState.playerScore - gameState.currentBet;
  
  let newPhase: GamePhase = 'dealer-turn';
  let result: GameResult | null = null;
  
  if (newPlayerHand.isBusted) {
    newPhase = 'game-over';
    result = 'dealer-wins';
  }
  
  return {
    ...gameState,
    deck: remainingDeck,
    playerHand: newPlayerHand,
    currentBet: newBet,
    playerScore: newScore,
    canDoubleDown: false,
    canSplit: false,
    canSurrender: false,
    phase: newPhase,
    result,
  };
}

/**
 * Player splits their hand
 */
function splitHand(gameState: GameState): GameState {
  if (!gameState.canSplit) {
    throw new Error('Cannot split hand');
  }
  
  // For now, implement basic split logic
  // In a full implementation, this would handle multiple hands
  const { card, remainingDeck } = dealCard(gameState.deck);
  const newPlayerHand = addCardToHand(gameState.playerHand, card);
  
  const newBet = gameState.currentBet * 2;
  const newScore = gameState.playerScore - gameState.currentBet;
  
  return {
    ...gameState,
    deck: remainingDeck,
    playerHand: newPlayerHand,
    currentBet: newBet,
    playerScore: newScore,
    canDoubleDown: false,
    canSplit: false,
    canSurrender: false,
  };
}

/**
 * Player surrenders
 */
function surrender(gameState: GameState): GameState {
  if (!gameState.canSurrender) {
    throw new Error('Cannot surrender');
  }
  
  const refund = gameState.currentBet / 2;
  
  return {
    ...gameState,
    playerScore: gameState.playerScore + refund,
    currentBet: 0,
    phase: 'game-over',
    result: 'dealer-wins',
  };
}

/**
 * Player takes insurance
 */
function takeInsurance(gameState: GameState): GameState {
  if (!gameState.canTakeInsurance) {
    throw new Error('Cannot take insurance');
  }
  
  const insuranceBet = gameState.currentBet / 2;
  
  return {
    ...gameState,
    playerScore: gameState.playerScore - insuranceBet,
    canTakeInsurance: false,
  };
}

/**
 * Dealer plays their hand
 */
export function playDealerHand(gameState: GameState): GameState {
  let newDeck = gameState.deck;
  let dealerHand = gameState.dealerHand;
  
  // Dealer must hit on 16, stand on 17
  while (dealerHand.total < 17 || (dealerHand.total === 17 && dealerHand.isSoft)) {
    const { card, remainingDeck } = dealCard(newDeck);
    newDeck = remainingDeck;
    dealerHand = addCardToHand(dealerHand, card);
  }
  
  const result = determineGameResult(gameState.playerHand, dealerHand);
  const winnings = calculateWinnings(gameState.currentBet, result);
  
  return {
    ...gameState,
    deck: newDeck,
    dealerHand,
    playerScore: gameState.playerScore + winnings,
    phase: 'game-over',
    result,
  };
}

/**
 * Determines the game result
 */
function determineGameResult(playerHand: Hand, dealerHand: Hand): GameResult {
  if (playerHand.isBusted) {
    return 'dealer-wins';
  }
  
  if (dealerHand.isBusted) {
    return 'player-wins';
  }
  
  if (playerHand.isBlackjack && !dealerHand.isBlackjack) {
    return 'player-blackjack';
  }
  
  if (dealerHand.isBlackjack && !playerHand.isBlackjack) {
    return 'dealer-blackjack';
  }
  
  if (playerHand.total > dealerHand.total) {
    return 'player-wins';
  }
  
  if (dealerHand.total > playerHand.total) {
    return 'dealer-wins';
  }
  
  return 'push';
}

/**
 * Calculates winnings based on result
 */
function calculateWinnings(bet: number, result: GameResult): number {
  switch (result) {
    case 'player-wins':
      return bet * 2;
    case 'player-blackjack':
      return Math.floor(bet * 2.5); // 3:2 payout
    case 'dealer-wins':
    case 'dealer-blackjack':
      return 0;
    case 'push':
      return bet;
    default:
      return 0;
  }
}

/**
 * Resets the game for a new round
 */
export function resetGame(gameState: GameState): GameState {
  return {
    ...gameState,
    playerHand: createEmptyHand(),
    dealerHand: createEmptyHand(),
    currentBet: 0,
    canDoubleDown: false,
    canSplit: false,
    canSurrender: false,
    canTakeInsurance: false,
    result: null,
    phase: 'betting',
    isGameActive: false,
  };
}
