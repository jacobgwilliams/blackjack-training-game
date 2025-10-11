import { GameSettings } from '../types/game';

export const DEFAULT_GAME_SETTINGS: GameSettings = {
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

export const CARD_VALUES = {
  ACE: 11,
  FACE_CARD: 10,
  BLACKJACK: 21,
  DEALER_STAND: 17,
  DEALER_HIT: 16,
} as const;

export const PAYOUTS = {
  BLACKJACK: 1.5, // 3:2
  WIN: 1, // 1:1
  PUSH: 0, // Return bet
  INSURANCE: 2, // 2:1
} as const;

export const GAME_PHASES = {
  WAITING: 'waiting',
  BETTING: 'betting',
  DEALING: 'dealing',
  PLAYER_TURN: 'player-turn',
  DEALER_TURN: 'dealer-turn',
  GAME_OVER: 'game-over',
  SHOWING_RESULTS: 'showing-results',
} as const;

export const PLAYER_ACTIONS = {
  HIT: 'hit',
  STAND: 'stand',
  DOUBLE_DOWN: 'double-down',
  SPLIT: 'split',
  SURRENDER: 'surrender',
  INSURANCE: 'insurance',
} as const;

export const GAME_RESULTS = {
  PLAYER_WINS: 'player-wins',
  DEALER_WINS: 'dealer-wins',
  PUSH: 'push',
  PLAYER_BLACKJACK: 'player-blackjack',
  DEALER_BLACKJACK: 'dealer-blackjack',
} as const;
