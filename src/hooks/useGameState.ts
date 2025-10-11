import { useState, useCallback, useReducer, useEffect } from 'react';
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
import { loadBalance, saveBalance, loadStatistics, saveStatistics, clearBalance } from '../utils/storage';

type GameStateAction = 
  | { type: 'INITIALIZE_GAME'; payload: { settings: GameSettings; preserveBalance?: boolean } }
  | { type: 'PLACE_BET'; payload: { betAmount: number } }
  | { type: 'DEAL_INITIAL_CARDS'; payload: { debugMode?: { enabled: boolean; forceSplitHands?: boolean } } }
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
      const { debugMode } = action.payload;
      return dealInitialCards(state, debugMode);
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
  
  // Update settings when initialSettings changes (e.g., debug mode toggle)
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings.debugMode?.enabled, initialSettings.debugMode?.forceSplitHands]);
  
  // Load saved balance from localStorage, fallback to default
  const savedBalance = loadBalance();
  const startingBalance = savedBalance !== null ? savedBalance : initialSettings.startingBalance;
  
  // Load saved statistics from localStorage
  const savedStats = loadStatistics();
  const [statistics, setStatistics] = useState<PlayerStatistics>({
    gamesPlayed: savedStats?.totalHands || 0,
    gamesWon: savedStats?.handsWon || 0,
    gamesLost: savedStats?.handsLost || 0,
    gamesPushed: savedStats?.pushes || 0,
    totalWinnings: savedStats?.totalWinnings || 0,
    currentBalance: startingBalance,
    strategyAccuracy: 0,
    averageHandValue: 0,
    blackjacks: savedStats?.blackjacks || 0,
    busts: savedStats?.busts || 0,
  });
  
  const [gameState, dispatch] = useReducer(gameStateReducer, {
    phase: 'betting',
    deck: [],
    playerHand: { cards: [], total: 0, isSoft: false, isBlackjack: false, isBusted: false },
    dealerHand: { cards: [], total: 0, isSoft: false, isBlackjack: false, isBusted: false },
    playerScore: startingBalance,
    currentBet: 0,
    canDoubleDown: false,
    canSplit: false,
    canSurrender: false,
    canTakeInsurance: false,
    result: null,
    isGameActive: false,
  });
  
  // Save balance to localStorage whenever it changes
  useEffect(() => {
    saveBalance(gameState.playerScore);
  }, [gameState.playerScore]);
  
  // Save statistics to localStorage whenever they change
  useEffect(() => {
    const statsToSave = {
      totalHands: statistics.gamesPlayed,
      handsWon: statistics.gamesWon,
      handsLost: statistics.gamesLost,
      pushes: statistics.gamesPushed,
      blackjacks: statistics.blackjacks,
      busts: statistics.busts,
      totalWinnings: statistics.totalWinnings,
    };
    saveStatistics(statsToSave);
  }, [statistics]);
  
  const initializeNewGame = useCallback((preserveBalance: boolean = true) => {
    dispatch({ type: 'INITIALIZE_GAME', payload: { settings, preserveBalance } });
  }, [settings]);
  
  const makeBet = useCallback((betAmount: number) => {
    dispatch({ type: 'PLACE_BET', payload: { betAmount } });
  }, []);
  
  const startGame = useCallback(() => {
    dispatch({ type: 'DEAL_INITIAL_CARDS', payload: { debugMode: settings.debugMode } });
  }, [settings.debugMode]);
  
  const playerAction = useCallback((action: PlayerAction) => {
    dispatch({ type: 'EXECUTE_PLAYER_ACTION', payload: { action } });
  }, []);
  
  const dealerPlay = useCallback(() => {
    dispatch({ type: 'PLAY_DEALER_HAND' });
  }, []);
  
  const newGame = useCallback(() => {
    // Reset game and reinitialize with starting balance
    clearBalance(); // Clear saved balance from localStorage
    dispatch({ type: 'INITIALIZE_GAME', payload: { settings, preserveBalance: false } });
  }, [settings]);
  
  const resetStatistics = useCallback(() => {
    // Reset all statistics
    setStatistics({
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesPushed: 0,
      totalWinnings: 0,
      currentBalance: gameState.playerScore,
      strategyAccuracy: 0,
      averageHandValue: 0,
      blackjacks: 0,
      busts: 0,
    });
  }, [gameState.playerScore]);
  
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
      resetStatistics,
      updateSettings,
      updateStatistics,
    },
  };
}
