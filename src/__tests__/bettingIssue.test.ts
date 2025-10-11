import { 
  initializeGame, 
  placeBet, 
  dealInitialCards 
} from '../utils/gameLogic';
import { createShoe, shuffleDeck } from '../utils/cardUtils';
import { DEFAULT_GAME_SETTINGS } from '../constants/gameRules';

describe('Betting Issue Debug', () => {
  it('should properly transition from betting to dealing phase', () => {
    const deck = shuffleDeck(createShoe(6));
    const gameState = initializeGame(deck, DEFAULT_GAME_SETTINGS.startingBalance, 6);
    
    // Initial state should be betting
    expect(gameState.phase).toBe('betting');
    expect(gameState.currentBet).toBe(0);
    expect(gameState.isGameActive).toBe(false);
    
    // Place a bet
    const betState = placeBet(gameState, 25);
    
    // Should transition to dealing phase
    expect(betState.phase).toBe('dealing');
    expect(betState.currentBet).toBe(25);
    expect(betState.playerScore).toBe(975);
    expect(betState.isGameActive).toBe(true);
    
    // Deal initial cards
    const dealtState = dealInitialCards(betState);
    
    // Should transition to player turn
    expect(dealtState.phase).toBe('player-turn');
    expect(dealtState.playerHand.cards).toHaveLength(2);
    expect(dealtState.dealerHand.cards).toHaveLength(2);
    expect(dealtState.canDoubleDown).toBe(true);
  });

  it('should maintain proper state transitions', () => {
    const deck = shuffleDeck(createShoe(6));
    let gameState = initializeGame(deck, DEFAULT_GAME_SETTINGS.startingBalance, 6);
    
    // Step 1: Betting
    expect(gameState.phase).toBe('betting');
    
    // Step 2: Place bet
    gameState = placeBet(gameState, 50);
    expect(gameState.phase).toBe('dealing');
    expect(gameState.currentBet).toBe(50);
    
    // Step 3: Deal cards
    gameState = dealInitialCards(gameState);
    expect(gameState.phase).toBe('player-turn');
    expect(gameState.playerHand.cards).toHaveLength(2);
    expect(gameState.dealerHand.cards).toHaveLength(2);
    
    // Verify all state is consistent
    expect(gameState.currentBet).toBe(50);
    expect(gameState.playerScore).toBe(950);
    expect(gameState.isGameActive).toBe(true);
    expect(gameState.canDoubleDown).toBe(true);
    expect(gameState.canSplit).toBeDefined();
    expect(gameState.canSurrender).toBe(true);
  });

  it.skip('should handle multiple bet attempts correctly', () => {
    const deck = shuffleDeck(createShoe(6));
    let gameState = initializeGame(deck, DEFAULT_GAME_SETTINGS.startingBalance, 6);
    
    // First bet attempt
    gameState = placeBet(gameState, 25);
    expect(gameState.phase).toBe('dealing');
    expect(gameState.currentBet).toBe(25);
    
    // Deal cards
    gameState = dealInitialCards(gameState);
    expect(gameState.phase).toBe('player-turn');
    
    // Try to place another bet (should not work)
    expect(() => placeBet(gameState, 50)).toThrow('Can only place bets during betting phase');
  });

  it('should validate bet amounts correctly', () => {
    const deck = shuffleDeck(createShoe(6));
    const gameState = initializeGame(deck, 100); // Low balance
    
    // Should allow bet within balance
    const validBet = placeBet(gameState, 50);
    expect(validBet.currentBet).toBe(50);
    expect(validBet.playerScore).toBe(50);
    
    // Should reject bet exceeding balance
    expect(() => placeBet(gameState, 150)).toThrow('Insufficient funds');
  });
});
