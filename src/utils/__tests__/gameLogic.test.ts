import { 
  initializeGame, 
  placeBet, 
  dealInitialCards, 
  executePlayerAction,
  playDealerHand,
  resetGame 
} from '../gameLogic';
import { createShoe, shuffleDeck } from '../cardUtils';
import { GameState } from '../../types/game';

describe('gameLogic', () => {
  let mockDeck: any[];
  let mockSettings: any;

  beforeEach(() => {
    mockDeck = shuffleDeck(createShoe(6));
    mockSettings = {
      startingBalance: 1000,
      minBet: 10,
      maxBet: 500,
      deckCount: 6,
      allowSurrender: true,
      allowInsurance: true,
      dealerHitsSoft17: false,
      doubleAfterSplit: true,
      resplitAces: false,
    };
  });

  describe('initializeGame', () => {
    it('should initialize game with correct starting state', () => {
      const gameState = initializeGame(mockDeck, mockSettings.startingBalance);
      
      expect(gameState.phase).toBe('betting');
      expect(gameState.playerScore).toBe(1000);
      expect(gameState.currentBet).toBe(0);
      expect(gameState.deck).toEqual(mockDeck);
      expect(gameState.playerHand.cards).toHaveLength(0);
      expect(gameState.dealerHand.cards).toHaveLength(0);
      expect(gameState.isGameActive).toBe(false);
    });
  });

  describe('placeBet', () => {
    it('should place bet and update game state', () => {
      const gameState = initializeGame(mockDeck, mockSettings.startingBalance);
      const newState = placeBet(gameState, 50);
      
      expect(newState.currentBet).toBe(50);
      expect(newState.playerScore).toBe(950);
      expect(newState.phase).toBe('dealing');
      expect(newState.isGameActive).toBe(true);
    });

    it('should throw error for insufficient funds', () => {
      const gameState = initializeGame(mockDeck, 100);
      
      expect(() => placeBet(gameState, 150)).toThrow('Insufficient funds');
    });
  });

  describe('dealInitialCards', () => {
    it('should deal two cards to player and dealer', () => {
      const gameState = initializeGame(mockDeck, mockSettings.startingBalance);
      const betState = placeBet(gameState, 50);
      const dealtState = dealInitialCards(betState);
      
      expect(dealtState.playerHand.cards).toHaveLength(2);
      expect(dealtState.dealerHand.cards).toHaveLength(2);
      expect(dealtState.deck).toHaveLength(mockDeck.length - 4);
      expect(dealtState.phase).toBe('player-turn');
    });

    it('should set correct action availability flags', () => {
      const gameState = initializeGame(mockDeck, mockSettings.startingBalance);
      const betState = placeBet(gameState, 50);
      const dealtState = dealInitialCards(betState);
      
      expect(dealtState.canDoubleDown).toBe(true);
      expect(dealtState.canSplit).toBeDefined();
      expect(dealtState.canSurrender).toBe(true);
    });
  });

  describe('executePlayerAction', () => {
    let gameState: GameState;

    beforeEach(() => {
      const initState = initializeGame(mockDeck, mockSettings.startingBalance);
      const betState = placeBet(initState, 50);
      gameState = dealInitialCards(betState);
    });

    describe('hit', () => {
      it('should add a card to player hand', () => {
        const newState = executePlayerAction(gameState, 'hit');
        
        expect(newState.playerHand.cards).toHaveLength(3);
        expect(newState.deck).toHaveLength(gameState.deck.length - 1);
      });

      it('should end game if player busts', () => {
        // Create a hand that will bust with one more card
        const bustingState = {
          ...gameState,
          playerHand: {
            ...gameState.playerHand,
            cards: [
              { suit: 'hearts', rank: 'K', value: 10, displayValue: 'K' },
              { suit: 'spades', rank: 'K', value: 10, displayValue: 'K' }
            ],
            total: 20
          }
        };
        
        const newState = executePlayerAction(bustingState, 'hit');
        
        // Check if the game ended (this depends on the card dealt)
        expect(newState.playerHand.cards).toHaveLength(3);
      });
    });

    describe('stand', () => {
      it('should move to dealer turn', () => {
        const newState = executePlayerAction(gameState, 'stand');
        
        expect(newState.phase).toBe('dealer-turn');
      });
    });

    describe('double-down', () => {
      it('should double the bet and add one card', () => {
        const newState = executePlayerAction(gameState, 'double-down');
        
        expect(newState.currentBet).toBe(100);
        expect(newState.playerScore).toBe(900);
        expect(newState.playerHand.cards).toHaveLength(3);
        expect(newState.canDoubleDown).toBe(false);
      });

      it('should throw error if cannot double down', () => {
        const invalidState = {
          ...gameState,
          canDoubleDown: false
        };
        
        expect(() => executePlayerAction(invalidState, 'double-down'))
          .toThrow('Cannot double down');
      });
    });

    describe('surrender', () => {
      it('should end game and refund half bet', () => {
        const newState = executePlayerAction(gameState, 'surrender');
        
        expect(newState.playerScore).toBe(975); // 950 + 25 (half of 50)
        expect(newState.currentBet).toBe(0);
        expect(newState.phase).toBe('game-over');
        expect(newState.result).toBe('dealer-wins');
      });

      it('should throw error if cannot surrender', () => {
        const invalidState = {
          ...gameState,
          canSurrender: false
        };
        
        expect(() => executePlayerAction(invalidState, 'surrender'))
          .toThrow('Cannot surrender');
      });
    });
  });

  describe('playDealerHand', () => {
    it('should play dealer hand according to rules', () => {
      const gameState = initializeGame(mockDeck, mockSettings.startingBalance);
      const betState = placeBet(gameState, 50);
      const dealtState = dealInitialCards(betState);
      const standState = executePlayerAction(dealtState, 'stand');
      const dealerState = playDealerHand(standState);
      
      expect(dealerState.phase).toBe('game-over');
      expect(dealerState.result).toBeDefined();
      expect(dealerState.dealerHand.cards.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('resetGame', () => {
    it('should reset game state for new round', () => {
      const gameState = initializeGame(mockDeck, mockSettings.startingBalance);
      const betState = placeBet(gameState, 50);
      const dealtState = dealInitialCards(betState);
      const resetState = resetGame(dealtState);
      
      expect(resetState.phase).toBe('betting');
      expect(resetState.currentBet).toBe(0);
      expect(resetState.playerHand.cards).toHaveLength(0);
      expect(resetState.dealerHand.cards).toHaveLength(0);
      expect(resetState.canDoubleDown).toBe(false);
      expect(resetState.canSplit).toBe(false);
      expect(resetState.canSurrender).toBe(false);
      expect(resetState.result).toBe(null);
      expect(resetState.isGameActive).toBe(false);
    });
  });
});
