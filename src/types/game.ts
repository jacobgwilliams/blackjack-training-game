import { Hand, Deck } from './card';

export type GamePhase = 
  | 'landing' 
  | 'run-complete'
  | 'waiting' 
  | 'betting' 
  | 'dealing' 
  | 'player-turn' 
  | 'dealer-turn' 
  | 'game-over' 
  | 'showing-results';

export type PlayerAction = 
  | 'hit' 
  | 'stand' 
  | 'double-down' 
  | 'split' 
  | 'surrender' 
  | 'insurance';

export type GameResult = 
  | 'player-wins' 
  | 'dealer-wins' 
  | 'push' 
  | 'player-blackjack' 
  | 'dealer-blackjack';

export interface SplitHandState {
  hand: Hand;
  bet: number;
  isComplete: boolean;
  result: GameResult | null;
}

export interface GameState {
  phase: GamePhase;
  deck: Deck;
  playerHand: Hand;
  dealerHand: Hand;
  playerScore: number;
  currentBet: number;
  canDoubleDown: boolean;
  canSplit: boolean;
  canSurrender: boolean;
  canTakeInsurance: boolean;
  result: GameResult | null;
  isGameActive: boolean;
  // Split-specific state
  isSplit: boolean;
  splitHands: SplitHandState[];
  activeSplitHandIndex: number;
  // Shoe management
  showShuffleNotification?: boolean;
  shoeSize: number; // Track current shoe size for reshuffling
  // Win/loss tracking
  lastHandWinnings?: number; // Amount won/lost in the last hand
  previousBalance?: number; // Balance before the last hand
}

export type DebugScenario = 'none' | 'double-down' | 'hit' | 'stand' | 'split';

export interface GameSettings {
  startingBalance: number;
  minBet: number;
  maxBet: number;
  deckCount: number;
  shoeSize: number; // Number of decks in the shoe (1-8)
  allowSurrender: boolean;
  allowInsurance: boolean;
  dealerHitsSoft17: boolean;
  doubleAfterSplit: boolean;
  resplitAces: boolean;
  debugMode?: {
    enabled: boolean;
    scenario?: DebugScenario;
  };
}

export interface RunStatistics {
  runId: string;
  startTime: number;
  endTime?: number;
  handsPlayed: number;
  handsWon: number;
  handsLost: number;
  handsPushed: number;
  netProfit: number;
  startingBalance: number;
  endingBalance: number;
  blackjacks: number;
  busts: number;
  isActive: boolean;
}

export interface PlayerStatistics {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesPushed: number;
  totalWinnings: number;
  currentBalance: number;
  strategyAccuracy: number;
  averageHandValue: number;
  blackjacks: number;
  busts: number;
  // Run tracking
  totalRuns: number;
  activeRun?: RunStatistics;
  runHistory: RunStatistics[];
}

export interface StrategyRecommendation {
  action: PlayerAction;
  confidence: number; // 0-100
  reasoning: string;
  expectedValue: number;
}

export interface TrainingMode {
  id: string;
  name: string;
  description: string;
  showHints: boolean;
  showProbabilities: boolean;
  allowMistakes: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
