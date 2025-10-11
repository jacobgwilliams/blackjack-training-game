import { initializeGame, playDealerHand, placeBet, dealInitialCards } from '../gameLogic';
import { createShoe, shuffleDeck } from '../cardUtils';

describe('Win/Loss Display Feature', () => {
  it('should track win/loss amounts for normal hands', () => {
    const deck = shuffleDeck(createShoe(6));
    let gameState = initializeGame(deck, 1000, 6);
    
    // Place a bet
    gameState = placeBet(gameState, 50);
    
    // Deal initial cards (force a winning hand)
    gameState = dealInitialCards(gameState, { enabled: true, scenario: 'none' });
    
    // Force a player win scenario
    gameState = {
      ...gameState,
      playerHand: {
        cards: [
          { suit: 'hearts', rank: 'K', value: 10, displayValue: 'K' },
          { suit: 'diamonds', rank: 'Q', value: 10, displayValue: 'Q' }
        ],
        total: 20,
        isSoft: false,
        isBlackjack: false,
        isBusted: false
      },
      dealerHand: {
        cards: [
          { suit: 'spades', rank: '9', value: 9, displayValue: '9' },
          { suit: 'clubs', rank: '8', value: 8, displayValue: '8' }
        ],
        total: 17,
        isSoft: false,
        isBlackjack: false,
        isBusted: false
      }
    };
    
    // Play dealer hand
    gameState = playDealerHand(gameState);
    
    // Check that win/loss tracking is working
    expect(gameState.lastHandWinnings).toBe(50); // 100 total return - 50 bet = 50 net profit
    expect(gameState.previousBalance).toBe(950); // 1000 - 50 bet = 950
    expect(gameState.playerScore).toBe(1050); // 950 + 100 total return = 1050
    expect(gameState.phase).toBe('game-over');
  });
  
  it('should track win/loss amounts for split hands', () => {
    const deck = shuffleDeck(createShoe(6));
    let gameState = initializeGame(deck, 1000, 6);
    
    // Place a bet
    gameState = placeBet(gameState, 50);
    
    // Deal initial cards (force a split scenario)
    gameState = dealInitialCards(gameState, { enabled: true, scenario: 'split' });
    
    // Force a split scenario with mixed results
    gameState = {
      ...gameState,
      isSplit: true,
      splitHands: [
        {
          hand: {
            cards: [
              { suit: 'hearts', rank: '8', value: 8, displayValue: '8' },
              { suit: 'diamonds', rank: '8', value: 8, displayValue: '8' },
              { suit: 'spades', rank: '5', value: 5, displayValue: '5' }
            ],
            total: 21,
            isSoft: false,
            isBlackjack: false,
            isBusted: false
          },
          bet: 50,
          isComplete: false,
          result: null
        },
        {
          hand: {
            cards: [
              { suit: 'clubs', rank: '8', value: 8, displayValue: '8' },
              { suit: 'hearts', rank: '8', value: 8, displayValue: '8' },
              { suit: 'diamonds', rank: '6', value: 6, displayValue: '6' }
            ],
            total: 22,
            isSoft: false,
            isBlackjack: false,
            isBusted: true
          },
          bet: 50,
          isComplete: false,
          result: null
        }
      ],
      dealerHand: {
        cards: [
          { suit: 'spades', rank: '9', value: 9, displayValue: '9' },
          { suit: 'clubs', rank: '8', value: 8, displayValue: '8' }
        ],
        total: 17,
        isSoft: false,
        isBlackjack: false,
        isBusted: false
      }
    };
    
    // Play dealer hand
    gameState = playDealerHand(gameState);
    
    // Check that win/loss tracking is working for split hands
    expect(gameState.lastHandWinnings).toBe(0); // First hand: 100 return - 50 bet = 50 profit, Second hand: 0 return - 50 bet = -50 loss, Net: 50 - 50 = 0
    expect(gameState.previousBalance).toBe(950); // Balance before dealer play (after first bet, before split)
    expect(gameState.playerScore).toBe(1050); // 950 + 100 total return = 1050
    expect(gameState.phase).toBe('game-over');
  });
  
  it('should clear win/loss tracking when starting new hand', () => {
    const deck = shuffleDeck(createShoe(6));
    let gameState = initializeGame(deck, 1000, 6);
    
    // Simulate a completed hand with win/loss tracking
    gameState = {
      ...gameState,
      lastHandWinnings: 100,
      previousBalance: 950,
      playerScore: 1050,
      phase: 'betting' // Set to betting phase so we can place a new bet
    };
    
    // Place a new bet (should clear win/loss tracking)
    gameState = placeBet(gameState, 50);
    
    // Check that win/loss tracking is cleared
    expect(gameState.lastHandWinnings).toBeUndefined();
    expect(gameState.previousBalance).toBeUndefined();
    expect(gameState.phase).toBe('dealing');
  });
});
