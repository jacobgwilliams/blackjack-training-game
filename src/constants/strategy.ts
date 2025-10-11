export const STRATEGY_CONFIDENCE_LEVELS = {
  VERY_HIGH: 95,
  HIGH: 90,
  MEDIUM: 80,
  LOW: 70,
  VERY_LOW: 60,
} as const;

export const STRATEGY_EXPLANATIONS = {
  HIT: 'Hit - Take another card',
  STAND: 'Stand - Keep your current hand',
  DOUBLE_DOWN: 'Double Down - Double your bet and take exactly one more card',
  SPLIT: 'Split - Split your pair into two separate hands',
  SURRENDER: 'Surrender - Give up half your bet and end the hand',
  INSURANCE: 'Insurance - Side bet against dealer blackjack',
} as const;

export const BASIC_STRATEGY_TIPS = [
  'Always split Aces and 8s',
  'Never split 10s, 5s, or 4s',
  'Double down on 11 vs dealer 2-10',
  'Double down on 10 vs dealer 2-9',
  'Double down on 9 vs dealer 3-6',
  'Never take insurance',
  'Surrender 16 vs dealer 9, 10, or Ace',
  'Surrender 15 vs dealer 10',
  'Hit soft 17 and below',
  'Stand on hard 17 and above',
] as const;

export const PROBABILITY_THRESHOLDS = {
  VERY_GOOD: 0.6,
  GOOD: 0.55,
  NEUTRAL: 0.5,
  BAD: 0.45,
  VERY_BAD: 0.4,
} as const;
