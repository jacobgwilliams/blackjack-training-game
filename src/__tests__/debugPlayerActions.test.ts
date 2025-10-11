import { 
  initializeGame, 
  placeBet, 
  dealInitialCards, 
  executePlayerAction 
} from '../utils/gameLogic';
import { createShoe, shuffleDeck } from '../utils/cardUtils';
import { DEFAULT_GAME_SETTINGS } from '../constants/gameRules';

describe('Debug Player Actions', () => {
  it('should handle hit action without crashing', () => {
    const deck = shuffleDeck(createShoe(6));
    let gameState = initializeGame(deck, DEFAULT_GAME_SETTINGS.startingBalance);
    
    // Place bet and deal cards
    gameState = placeBet(gameState, 25);
    gameState = dealInitialCards(gameState);
    
    console.log('Game state before hit:', gameState);
    
    // Try to hit
    const newState = executePlayerAction(gameState, 'hit');
    
    console.log('Game state after hit:', newState);
    
    expect(newState.playerHand.cards).toHaveLength(3);
    expect(newState.deck.length).toBe(gameState.deck.length - 1);
  });

  it('should handle stand action without crashing', () => {
    const deck = shuffleDeck(createShoe(6));
    let gameState = initializeGame(deck, DEFAULT_GAME_SETTINGS.startingBalance);
    
    // Place bet and deal cards
    gameState = placeBet(gameState, 25);
    gameState = dealInitialCards(gameState);
    
    console.log('Game state before stand:', gameState);
    
    // Try to stand
    const newState = executePlayerAction(gameState, 'stand');
    
    console.log('Game state after stand:', newState);
    
    expect(newState.phase).toBe('dealer-turn');
  });

  it('should handle double down action without crashing', () => {
    const deck = shuffleDeck(createShoe(6));
    let gameState = initializeGame(deck, DEFAULT_GAME_SETTINGS.startingBalance);
    
    // Place bet and deal cards
    gameState = placeBet(gameState, 25);
    gameState = dealInitialCards(gameState);
    
    console.log('Game state before double down:', gameState);
    
    // Try to double down
    const newState = executePlayerAction(gameState, 'double-down');
    
    console.log('Game state after double down:', newState);
    
    expect(newState.currentBet).toBe(50);
    expect(newState.playerHand.cards).toHaveLength(3);
  });

  it('should handle surrender action without crashing', () => {
    const deck = shuffleDeck(createShoe(6));
    let gameState = initializeGame(deck, DEFAULT_GAME_SETTINGS.startingBalance);
    
    // Place bet and deal cards
    gameState = placeBet(gameState, 25);
    gameState = dealInitialCards(gameState);
    
    console.log('Game state before surrender:', gameState);
    
    // Try to surrender
    const newState = executePlayerAction(gameState, 'surrender');
    
    console.log('Game state after surrender:', newState);
    
    expect(newState.phase).toBe('game-over');
    expect(newState.result).toBe('dealer-wins');
  });
});
