import { Card, Hand, Deck } from './card';

export type GamePhase = 
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
}

export interface GameSettings {
  startingBalance: number;
  minBet: number;
  maxBet: number;
  deckCount: number;
  allowSurrender: boolean;
  allowInsurance: boolean;
  dealerHitsSoft17: boolean;
  doubleAfterSplit: boolean;
  resplitAces: boolean;
  debugMode?: {
    enabled: boolean;
    forceSplitHands?: boolean;
  };
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
