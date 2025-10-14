import { useState, useCallback, useEffect } from 'react';
import { PlayerStatistics } from '../types/game';

const STATISTICS_STORAGE_KEY = 'blackjack-training-statistics';

export function useStatistics() {
  const [statistics, setStatistics] = useState<PlayerStatistics>(() => {
    const saved = localStorage.getItem(STATISTICS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesPushed: 0,
      totalWinnings: 0,
      currentBalance: 1000,
      strategyAccuracy: 0,
      averageHandValue: 0,
      blackjacks: 0,
      busts: 0,
    };
  });
  
  // Save statistics to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(statistics));
  }, [statistics]);
  
  const updateGameResult = useCallback((result: string, betAmount: number) => {
    setStatistics(prev => {
      const newStats = { ...prev };
      newStats.gamesPlayed++;
      
      switch (result) {
        case 'player-wins':
        case 'player-blackjack':
          newStats.gamesWon++;
          newStats.totalWinnings += betAmount;
          break;
        case 'dealer-wins':
        case 'dealer-blackjack':
          newStats.gamesLost++;
          newStats.totalWinnings -= betAmount;
          break;
        case 'push':
          newStats.gamesPushed++;
          break;
      }
      
      return newStats;
    });
  }, []);
  
  const updateBalance = useCallback((newBalance: number) => {
    setStatistics(prev => ({
      ...prev,
      currentBalance: newBalance,
    }));
  }, []);
  
  const updateHandStats = useCallback((handValue: number, isBlackjack: boolean, isBusted: boolean) => {
    setStatistics(prev => {
      const newStats = { ...prev };
      
      // Update average hand value
      newStats.averageHandValue = (prev.averageHandValue * prev.gamesPlayed + handValue) / (prev.gamesPlayed + 1);
      
      if (isBlackjack) {
        newStats.blackjacks++;
      }
      
      if (isBusted) {
        newStats.busts++;
      }
      
      return newStats;
    });
  }, []);
  
  const updateStrategyAccuracy = useCallback((correctMoves: number, totalMoves: number) => {
    setStatistics(prev => ({
      ...prev,
      strategyAccuracy: totalMoves > 0 ? (correctMoves / totalMoves) * 100 : 0,
    }));
  }, []);
  
  const resetStatistics = useCallback(() => {
    setStatistics({
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesPushed: 0,
      totalWinnings: 0,
      currentBalance: 1000,
      strategyAccuracy: 0,
      averageHandValue: 0,
      blackjacks: 0,
      busts: 0,
      totalRuns: 0,
      runHistory: [],
    });
  }, []);
  
  const getWinRate = useCallback(() => {
    return statistics.gamesPlayed > 0 ? (statistics.gamesWon / statistics.gamesPlayed) * 100 : 0;
  }, [statistics.gamesWon, statistics.gamesPlayed]);
  
  const getLossRate = useCallback(() => {
    return statistics.gamesPlayed > 0 ? (statistics.gamesLost / statistics.gamesPlayed) * 100 : 0;
  }, [statistics.gamesLost, statistics.gamesPlayed]);
  
  const getPushRate = useCallback(() => {
    return statistics.gamesPlayed > 0 ? (statistics.gamesPushed / statistics.gamesPlayed) * 100 : 0;
  }, [statistics.gamesPushed, statistics.gamesPlayed]);
  
  const getBlackjackRate = useCallback(() => {
    return statistics.gamesPlayed > 0 ? (statistics.blackjacks / statistics.gamesPlayed) * 100 : 0;
  }, [statistics.blackjacks, statistics.gamesPlayed]);
  
  const getBustRate = useCallback(() => {
    return statistics.gamesPlayed > 0 ? (statistics.busts / statistics.gamesPlayed) * 100 : 0;
  }, [statistics.busts, statistics.gamesPlayed]);
  
  const getProfitLoss = useCallback(() => {
    return statistics.totalWinnings;
  }, [statistics.totalWinnings]);
  
  const getAverageBet = useCallback(() => {
    return statistics.gamesPlayed > 0 ? Math.abs(statistics.totalWinnings) / statistics.gamesPlayed : 0;
  }, [statistics.totalWinnings, statistics.gamesPlayed]);
  
  return {
    statistics,
    updateGameResult,
    updateBalance,
    updateHandStats,
    updateStrategyAccuracy,
    resetStatistics,
    getWinRate,
    getLossRate,
    getPushRate,
    getBlackjackRate,
    getBustRate,
    getProfitLoss,
    getAverageBet,
  };
}
