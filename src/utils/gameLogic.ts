import { GameState, GameResult, PlayerAction, GamePhase } from '../types/game';
import { Hand, Card } from '../types/card';
import { dealCard, addCardToHand, createEmptyHand, canSplitHand, canDoubleDown, canSurrender } from './cardUtils';
import { DEFAULT_GAME_SETTINGS } from '../constants/gameRules';

/**
 * Initializes a new game state
 */
export function initializeGame(deck: Card[], startingBalance: number, preserveBalance?: boolean): GameState {
  return {
    phase: 'betting',
    deck,
    playerHand: createEmptyHand(),
    dealerHand: createEmptyHand(),
    playerScore: preserveBalance === false ? DEFAULT_GAME_SETTINGS.startingBalance : startingBalance,
    currentBet: 0,
    canDoubleDown: false,
    canSplit: false,
    canSurrender: false,
    canTakeInsurance: false,
    result: null,
    isGameActive: false,
    isSplit: false,
    splitHands: [],
    activeSplitHandIndex: 0,
  };
}

/**
 * Places a bet and starts the game
 */
export function placeBet(gameState: GameState, betAmount: number): GameState {
  if (betAmount > gameState.playerScore) {
    throw new Error('Insufficient funds');
  }
  
  if (gameState.phase !== 'betting') {
    throw new Error('Can only place bets during betting phase');
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
export function dealInitialCards(gameState: GameState, debugMode?: { enabled: boolean; forceSplitHands?: boolean }): GameState {
  let newDeck = gameState.deck;
  let playerHand = gameState.playerHand;
  let dealerHand = gameState.dealerHand;
  
  // Debug mode: force a split opportunity
  if (debugMode?.enabled && debugMode?.forceSplitHands) {
    // Find two cards with the same rank in the deck for testing
    const deckCopy = [...newDeck];
    
    // Find first card with rank 8, 9, or 10 (good split candidates)
    const goodRanks = ['8', '9', '10', 'J', 'Q', 'K'];
    const firstCardIndex = deckCopy.findIndex(card => goodRanks.includes(card.rank));
    
    if (firstCardIndex >= 0) {
      const firstCard = deckCopy[firstCardIndex];
      deckCopy.splice(firstCardIndex, 1);
      
      // Find a matching rank
      const secondCardIndex = deckCopy.findIndex(card => card.rank === firstCard.rank);
      
      if (secondCardIndex >= 0) {
        const secondCard = deckCopy[secondCardIndex];
        deckCopy.splice(secondCardIndex, 1);
        
        // Add the pair to player hand
        playerHand = addCardToHand(playerHand, firstCard);
        playerHand = addCardToHand(playerHand, secondCard);
        
        // Deal dealer cards normally
        for (let i = 0; i < 2; i++) {
          const { card, remainingDeck } = dealCard(deckCopy);
          deckCopy.splice(0, 1);
          dealerHand = addCardToHand(dealerHand, card);
        }
        
        newDeck = deckCopy;
      } else {
        // Fallback to normal dealing if no match found
        for (let i = 0; i < 2; i++) {
          const { card, remainingDeck } = dealCard(newDeck);
          newDeck = remainingDeck;
          playerHand = addCardToHand(playerHand, card);
        }
        
        for (let i = 0; i < 2; i++) {
          const { card, remainingDeck } = dealCard(newDeck);
          newDeck = remainingDeck;
          dealerHand = addCardToHand(dealerHand, card);
        }
      }
    }
  } else {
    // Normal dealing
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
  let newGameState = { ...gameState };
  
  if (gameState.isSplit) {
    // Handle hit for split hands
    const newSplitHands = [...gameState.splitHands];
    const activeIndex = gameState.activeSplitHandIndex;
    
    newSplitHands[activeIndex] = {
      ...newSplitHands[activeIndex],
      hand: newPlayerHand,
    };
    
    // If hand busted, mark it complete and move to next hand
    if (newPlayerHand.isBusted) {
      newSplitHands[activeIndex].isComplete = true;
      newSplitHands[activeIndex].result = 'dealer-wins';
      
      // Move to next hand or dealer turn
      if (activeIndex < newSplitHands.length - 1) {
        const nextIndex = activeIndex + 1;
        newGameState = {
          ...newGameState,
          playerHand: newSplitHands[nextIndex].hand,
          activeSplitHandIndex: nextIndex,
          canDoubleDown: true, // Can double on next hand
        };
      } else {
        // All hands complete, move to dealer turn or game over
        const allHandsBusted = newSplitHands.every(h => h.hand.isBusted);
        newPhase = allHandsBusted ? 'game-over' : 'dealer-turn';
      }
    }
    
    newGameState = {
      ...newGameState,
      deck: remainingDeck,
      playerHand: newPlayerHand,
      splitHands: newSplitHands,
      canDoubleDown: false, // Can't double after hitting
      canSplit: false,
      canSurrender: false,
      phase: newPhase,
      result,
    };
  } else {
    // Normal hit (non-split)
    if (newPlayerHand.isBusted) {
      newPhase = 'game-over';
      result = 'dealer-wins';
    }
    
    newGameState = {
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
  
  return newGameState;
}

/**
 * Player stands (ends their turn)
 */
function standPlayer(gameState: GameState): GameState {
  if (gameState.isSplit) {
    // Mark current hand as complete
    const newSplitHands = [...gameState.splitHands];
    const activeIndex = gameState.activeSplitHandIndex;
    newSplitHands[activeIndex].isComplete = true;
    
    // Move to next hand or dealer turn
    if (activeIndex < newSplitHands.length - 1) {
      const nextIndex = activeIndex + 1;
      return {
        ...gameState,
        splitHands: newSplitHands,
        playerHand: newSplitHands[nextIndex].hand,
        activeSplitHandIndex: nextIndex,
        canDoubleDown: true, // Can double on next hand
        canSurrender: false,
      };
    } else {
      // All hands complete, move to dealer turn
      return {
        ...gameState,
        splitHands: newSplitHands,
        phase: 'dealer-turn',
      };
    }
  } else {
    // Normal stand (non-split)
    return {
      ...gameState,
      phase: 'dealer-turn',
    };
  }
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
  
  if (gameState.playerScore < gameState.currentBet) {
    throw new Error('Insufficient funds to split');
  }
  
  // Split the two cards into separate hands
  const card1 = gameState.playerHand.cards[0];
  const card2 = gameState.playerHand.cards[1];
  
  // Create first hand with first card
  let hand1 = createEmptyHand();
  hand1 = addCardToHand(hand1, card1);
  
  // Create second hand with second card
  let hand2 = createEmptyHand();
  hand2 = addCardToHand(hand2, card2);
  
  // Deal one card to each hand
  let { card: newCard1, remainingDeck: deck1 } = dealCard(gameState.deck);
  hand1 = addCardToHand(hand1, newCard1);
  
  let { card: newCard2, remainingDeck: deck2 } = dealCard(deck1);
  hand2 = addCardToHand(hand2, newCard2);
  
  // Deduct additional bet for second hand
  const newPlayerScore = gameState.playerScore - gameState.currentBet;
  
  // Create split hand states
  const splitHands = [
    {
      hand: hand1,
      bet: gameState.currentBet,
      isComplete: false,
      result: null,
    },
    {
      hand: hand2,
      bet: gameState.currentBet,
      isComplete: false,
      result: null,
    },
  ];
  
  // Check if first hand is blackjack (but only counts as 21 after split)
  const firstHandBusted = hand1.isBusted;
  
  return {
    ...gameState,
    deck: deck2,
    playerHand: hand1, // Display first hand as the main hand
    playerScore: newPlayerScore,
    isSplit: true,
    splitHands,
    activeSplitHandIndex: 0,
    canDoubleDown: !firstHandBusted, // Can double on split hands (unless busted)
    canSplit: false, // Can't split again (simplified for now)
    canSurrender: false, // Can't surrender after split
    canTakeInsurance: false,
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
  
  if (gameState.isSplit) {
    // Calculate results for each split hand
    const newSplitHands = gameState.splitHands.map(splitHand => {
      const result = determineGameResult(splitHand.hand, dealerHand);
      const winnings = calculateWinnings(splitHand.bet, result);
      return {
        ...splitHand,
        result,
        isComplete: true,
      };
    });
    
    // Calculate total winnings from all hands
    const totalWinnings = newSplitHands.reduce((total, splitHand) => {
      return total + calculateWinnings(splitHand.bet, splitHand.result!);
    }, 0);
    
    // Use the first hand's result as the main result for statistics
    const primaryResult = newSplitHands[0].result!;
    
    return {
      ...gameState,
      deck: newDeck,
      dealerHand,
      splitHands: newSplitHands,
      playerScore: gameState.playerScore + totalWinnings,
      phase: 'game-over',
      result: primaryResult,
    };
  } else {
    // Normal (non-split) game
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
