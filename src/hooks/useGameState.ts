import { useState, useCallback, useReducer } from 'react';
import { GameState, GameSettings, PlayerAction, PlayerStatistics } from '../types/game';
import { Card } from '../types/card';
import { createShoe, shuffleDeck } from '../utils/cardUtils';
import { 
  initializeGame, 
  placeBet, 
  dealInitialCards, 
  executePlayerAction, 
  playDealerHand, 
  resetGame 
} from '../utils/gameLogic';
import { DEFAULT_GAME_SETTINGS } from '../constants/gameRules';

type GameStateAction = 
  | { type: 'INITIALIZE_GAME'; payload: { settings: GameSettings; preserveBalance?: boolean } }
  | { type: 'PLACE_BET'; payload: { betAmount: number } }
  | { type: 'DEAL_INITIAL_CARDS' }
  | { type: 'EXECUTE_PLAYER_ACTION'; payload: { action: PlayerAction } }
  | { type: 'PLAY_DEALER_HAND' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_STATISTICS'; payload: { result: string } };

function gameStateReducer(state: GameState, action: GameStateAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_GAME': {
      const { settings, preserveBalance } = action.payload;
      const deck = shuffleDeck(createShoe(settings.deckCount));
      return initializeGame(deck, state.playerScore, preserveBalance);
    }
    
    case 'PLACE_BET': {
      const { betAmount } = action.payload;
      return placeBet(state, betAmount);
    }
    
    case 'DEAL_INITIAL_CARDS': {
      return dealInitialCards(state);
    }
    
    case 'EXECUTE_PLAYER_ACTION': {
      const { action: playerAction } = action.payload;
      return executePlayerAction(state, playerAction);
    }
    
    case 'PLAY_DEALER_HAND': {
      return playDealerHand(state);
    }
    
    case 'RESET_GAME': {
      return resetGame(state);
    }
    
    default:
      return state;
  }
}

export function useGameState(initialSettings: GameSettings = DEFAULT_GAME_SETTINGS) {
  const [settings, setSettings] = useState<GameSettings>(initialSettings);
  const [statistics, setStatistics] = useState<PlayerStatistics>({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesPushed: 0,
    totalWinnings: 0,
    currentBalance: initialSettings.startingBalance,
    strategyAccuracy: 0,
    averageHandValue: 0,
    blackjacks: 0,
    busts: 0,
  });
  
  const [gameState, dispatch] = useReducer(gameStateReducer, {
    phase: 'betting',
    deck: [],
    playerHand: { cards: [], total: 0, isSoft: false, isBlackjack: false, isBusted: false },
    dealerHand: { cards: [], total: 0, isSoft: false, isBlackjack: false, isBusted: false },
    playerScore: initialSettings.startingBalance,
    currentBet: 0,
    canDoubleDown: false,
    canSplit: false,
    canSurrender: false,
    canTakeInsurance: false,
    result: null,
    isGameActive: false,
  });
  
  const initializeNewGame = useCallback((preserveBalance: boolean = true) => {
    dispatch({ type: 'INITIALIZE_GAME', payload: { settings, preserveBalance } });
  }, [settings]);
  
  const makeBet = useCallback((betAmount: number) => {
    dispatch({ type: 'PLACE_BET', payload: { betAmount } });
  }, []);
  
  const startGame = useCallback(() => {
    dispatch({ type: 'DEAL_INITIAL_CARDS' });
  }, []);
  
  const playerAction = useCallback((action: PlayerAction) => {
    dispatch({ type: 'EXECUTE_PLAYER_ACTION', payload: { action } });
  }, []);
  
  const dealerPlay = useCallback(() => {
    dispatch({ type: 'PLAY_DEALER_HAND' });
  }, []);
  
  const newGame = useCallback(() => {
    // Reset game and reinitialize with starting balance
    dispatch({ type: 'INITIALIZE_GAME', payload: { settings, preserveBalance: false } });
  }, [settings]);
  
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  const updateStatistics = useCallback((result: string) => {
    setStatistics(prev => {
      const newStats = { ...prev };
      newStats.gamesPlayed++;
      
      switch (result) {
        case 'player-wins':
        case 'player-blackjack':
          newStats.gamesWon++;
          newStats.totalWinnings += gameState.currentBet;
          break;
        case 'dealer-wins':
        case 'dealer-blackjack':
          newStats.gamesLost++;
          newStats.totalWinnings -= gameState.currentBet;
          break;
        case 'push':
          newStats.gamesPushed++;
          break;
      }
      
      newStats.currentBalance = gameState.playerScore;
      newStats.averageHandValue = (prev.averageHandValue + gameState.playerHand.total) / 2;
      
      if (gameState.playerHand.isBlackjack) {
        newStats.blackjacks++;
      }
      
      if (gameState.playerHand.isBusted) {
        newStats.busts++;
      }
      
      return newStats;
    });
  }, [gameState.currentBet, gameState.playerScore, gameState.playerHand]);
  
  return {
    gameState,
    settings,
    statistics,
    actions: {
      initializeNewGame,
      makeBet,
      startGame,
      playerAction,
      dealerPlay,
      newGame,
      updateSettings,
      updateStatistics,
    },
  };
}
