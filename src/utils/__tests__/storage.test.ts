import {
  saveBalance,
  loadBalance,
  clearBalance,
  saveStatistics,
  loadStatistics,
  clearStatistics,
  clearAllGameData,
  StoredStatistics,
} from '../storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Balance Storage', () => {
    it('should save and load balance', () => {
      saveBalance(1500);
      const loadedBalance = loadBalance();
      expect(loadedBalance).toBe(1500);
    });

    it('should return null when no balance is saved', () => {
      const loadedBalance = loadBalance();
      expect(loadedBalance).toBeNull();
    });

    it('should clear saved balance', () => {
      saveBalance(1500);
      clearBalance();
      const loadedBalance = loadBalance();
      expect(loadedBalance).toBeNull();
    });

    it('should handle zero balance', () => {
      saveBalance(0);
      const loadedBalance = loadBalance();
      expect(loadedBalance).toBe(0);
    });

    it('should handle negative balance', () => {
      saveBalance(-100);
      const loadedBalance = loadBalance();
      expect(loadedBalance).toBe(-100);
    });
  });

  describe('Statistics Storage', () => {
    const mockStats: StoredStatistics = {
      totalHands: 10,
      handsWon: 5,
      handsLost: 3,
      pushes: 2,
      blackjacks: 1,
      busts: 2,
      totalWinnings: 150,
    };

    it('should save and load statistics', () => {
      saveStatistics(mockStats);
      const loadedStats = loadStatistics();
      expect(loadedStats).toEqual(mockStats);
    });

    it('should return null when no statistics are saved', () => {
      const loadedStats = loadStatistics();
      expect(loadedStats).toBeNull();
    });

    it('should clear saved statistics', () => {
      saveStatistics(mockStats);
      clearStatistics();
      const loadedStats = loadStatistics();
      expect(loadedStats).toBeNull();
    });

    it('should handle statistics with zero values', () => {
      const zeroStats: StoredStatistics = {
        totalHands: 0,
        handsWon: 0,
        handsLost: 0,
        pushes: 0,
        blackjacks: 0,
        busts: 0,
        totalWinnings: 0,
      };
      saveStatistics(zeroStats);
      const loadedStats = loadStatistics();
      expect(loadedStats).toEqual(zeroStats);
    });

    it('should handle statistics with negative winnings', () => {
      const negativeStats: StoredStatistics = {
        ...mockStats,
        totalWinnings: -200,
      };
      saveStatistics(negativeStats);
      const loadedStats = loadStatistics();
      expect(loadedStats).toEqual(negativeStats);
    });
  });

  describe('Clear All Game Data', () => {
    it('should clear both balance and statistics', () => {
      const mockStats: StoredStatistics = {
        totalHands: 10,
        handsWon: 5,
        handsLost: 3,
        pushes: 2,
        blackjacks: 1,
        busts: 2,
        totalWinnings: 150,
      };

      saveBalance(1500);
      saveStatistics(mockStats);

      clearAllGameData();

      expect(loadBalance()).toBeNull();
      expect(loadStatistics()).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully when saving', () => {
      // Mock localStorage.setItem to throw an error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      // Should not throw
      expect(() => saveBalance(1000)).not.toThrow();
      expect(() => saveStatistics({
        totalHands: 1,
        handsWon: 1,
        handsLost: 0,
        pushes: 0,
        blackjacks: 0,
        busts: 0,
        totalWinnings: 25,
      })).not.toThrow();

      // Restore original
      Storage.prototype.setItem = originalSetItem;
    });

    it('should handle localStorage errors gracefully when loading', () => {
      // Mock localStorage.getItem to throw an error
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error('Storage access denied');
      });

      // Should return null instead of throwing
      expect(loadBalance()).toBeNull();
      expect(loadStatistics()).toBeNull();

      // Restore original
      Storage.prototype.getItem = originalGetItem;
    });

    it('should handle invalid JSON when loading statistics', () => {
      // Manually set invalid JSON
      localStorage.setItem('blackjack_statistics', 'invalid json {');
      
      // Should return null instead of throwing
      const stats = loadStatistics();
      expect(stats).toBeNull();
    });
  });
});

