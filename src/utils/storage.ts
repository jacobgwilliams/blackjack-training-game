/**
 * LocalStorage utility for persisting game data
 */

const STORAGE_KEYS = {
  BALANCE: 'blackjack_balance',
  STATISTICS: 'blackjack_statistics',
} as const;

export interface StoredStatistics {
  totalHands: number;
  handsWon: number;
  handsLost: number;
  pushes: number;
  blackjacks: number;
  busts: number;
  totalWinnings: number;
}

/**
 * Save balance to localStorage
 */
export function saveBalance(balance: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toString());
  } catch (error) {
    console.error('Failed to save balance to localStorage:', error);
  }
}

/**
 * Load balance from localStorage
 */
export function loadBalance(): number | null {
  try {
    const balance = localStorage.getItem(STORAGE_KEYS.BALANCE);
    return balance !== null ? parseInt(balance, 10) : null;
  } catch (error) {
    console.error('Failed to load balance from localStorage:', error);
    return null;
  }
}

/**
 * Clear balance from localStorage
 */
export function clearBalance(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.BALANCE);
  } catch (error) {
    console.error('Failed to clear balance from localStorage:', error);
  }
}

/**
 * Save statistics to localStorage
 */
export function saveStatistics(stats: StoredStatistics): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save statistics to localStorage:', error);
  }
}

/**
 * Load statistics from localStorage
 */
export function loadStatistics(): StoredStatistics | null {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.STATISTICS);
    return stats !== null ? JSON.parse(stats) : null;
  } catch (error) {
    console.error('Failed to load statistics from localStorage:', error);
    return null;
  }
}

/**
 * Clear statistics from localStorage
 */
export function clearStatistics(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATISTICS);
  } catch (error) {
    console.error('Failed to clear statistics from localStorage:', error);
  }
}

/**
 * Clear all game data from localStorage
 */
export function clearAllGameData(): void {
  clearBalance();
  clearStatistics();
}

