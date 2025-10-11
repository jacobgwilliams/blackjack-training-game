import { useMemo } from 'react';
import { Hand, Card } from '../types/card';
import { StrategyRecommendation, DebugScenario } from '../types/game';
import { 
  getBasicStrategyRecommendation, 
  getDoubleDownRecommendation, 
  getSurrenderRecommendation, 
  getInsuranceRecommendation,
  getAllStrategyRecommendations 
} from '../utils/strategy';

export function useBlackjackStrategy(playerHand: Hand, dealerUpcard: Card | null, trainingScenario: DebugScenario = 'none') {
  const recommendations = useMemo(() => {
    if (!dealerUpcard || playerHand.cards.length === 0) {
      return [];
    }
    
    return getAllStrategyRecommendations(playerHand, dealerUpcard);
  }, [playerHand, dealerUpcard]);
  
  const primaryRecommendation = useMemo(() => {
    if (recommendations.length === 0) return null;
    
    // Find the recommendation with the highest confidence
    const bestRec = recommendations.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
    
    // If in training mode and the best action doesn't match the training scenario, add context
    if (trainingScenario !== 'none' && bestRec) {
      const trainingActionMap: Record<DebugScenario, string> = {
        'none': '',
        'double-down': 'double-down',
        'hit': 'hit',
        'stand': 'stand',
        'split': 'split',
      };
      
      const expectedAction = trainingActionMap[trainingScenario];
      
      if (expectedAction && bestRec.action !== expectedAction) {
        // Add training context explaining why NOT to do the training action
        const trainingContext = getTrainingContext(trainingScenario, bestRec.action, playerHand, dealerUpcard);
        return {
          ...bestRec,
          reasoning: `${bestRec.reasoning}\n\n🎓 Training Note: ${trainingContext}`,
        };
      }
    }
    
    return bestRec;
  }, [recommendations, trainingScenario, playerHand, dealerUpcard]);
  
  const doubleDownRecommendation = useMemo(() => {
    if (!dealerUpcard) return null;
    return getDoubleDownRecommendation(playerHand, dealerUpcard);
  }, [playerHand, dealerUpcard]);
  
  const surrenderRecommendation = useMemo(() => {
    if (!dealerUpcard) return null;
    return getSurrenderRecommendation(playerHand, dealerUpcard);
  }, [playerHand, dealerUpcard]);
  
  const insuranceRecommendation = useMemo(() => {
    if (!dealerUpcard || dealerUpcard.rank !== 'A') return null;
    return getInsuranceRecommendation();
  }, [dealerUpcard]);
  
  const canDoubleDown = useMemo(() => {
    return doubleDownRecommendation !== null;
  }, [doubleDownRecommendation]);
  
  const canSurrender = useMemo(() => {
    return surrenderRecommendation !== null;
  }, [surrenderRecommendation]);
  
  const canTakeInsurance = useMemo(() => {
    return insuranceRecommendation !== null;
  }, [insuranceRecommendation]);
  
  const canSplit = useMemo(() => {
    return playerHand.cards.length === 2 && 
           playerHand.cards[0].rank === playerHand.cards[1].rank;
  }, [playerHand.cards]);
  
  const getActionConfidence = (action: string): number => {
    const recommendation = recommendations.find(rec => rec.action === action);
    return recommendation ? recommendation.confidence : 0;
  };
  
  const getActionReasoning = (action: string): string => {
    const recommendation = recommendations.find(rec => rec.action === action);
    return recommendation ? recommendation.reasoning : '';
  };
  
  const getExpectedValue = (action: string): number => {
    const recommendation = recommendations.find(rec => rec.action === action);
    return recommendation ? recommendation.expectedValue : 0;
  };
  
  return {
    recommendations,
    primaryRecommendation,
    doubleDownRecommendation,
    surrenderRecommendation,
    insuranceRecommendation,
    canDoubleDown,
    canSurrender,
    canTakeInsurance,
    canSplit,
    getActionConfidence,
    getActionReasoning,
    getExpectedValue,
  };
}

/**
 * Provides educational context when the optimal play doesn't match the training scenario
 */
function getTrainingContext(scenario: DebugScenario, actualBestAction: string, playerHand: Hand, dealerUpcard: Card): string {
  const total = playerHand.total;
  const dealerCard = dealerUpcard.rank;
  
  switch (scenario) {
    case 'double-down':
      if (actualBestAction === 'hit') {
        return `While you have ${total}, doubling down is NOT optimal here. You only double when you have 9-11 against a weak dealer (2-6). In this case, ${actualBestAction.toUpperCase()} gives you more flexibility to improve your hand without risking double the bet.`;
      }
      if (actualBestAction === 'stand') {
        return `With ${total}, you should STAND, not double down. Doubling is for strong starting totals (9-11) where one more card is likely to help. Your hand is already strong enough that doubling would be unnecessary risk.`;
      }
      return `Doubling down works best with totals of 9-11 against weak dealer cards (2-6). This situation doesn't fit that pattern.`;
    
    case 'hit':
      if (actualBestAction === 'stand') {
        return `With ${total} vs dealer ${dealerCard}, you should STAND, not hit. Hitting is for weak hands (12-16) against strong dealers (7-A). Your hand is strong enough that hitting risks busting without enough potential gain.`;
      }
      if (actualBestAction === 'double-down') {
        return `This is actually a DOUBLE DOWN situation, not just a hit. With ${total}, you have a strong starting hand worth doubling your bet on. Hitting alone would leave money on the table.`;
      }
      return `Hitting is best for weak hands (12-16) against strong dealers. This hand doesn't fit that pattern well.`;
    
    case 'stand':
      if (actualBestAction === 'hit') {
        return `With ${total} vs dealer ${dealerCard}, you should HIT, not stand. Standing is for strong hands (17+) or when the dealer is likely to bust (showing 4-6). Your hand is too weak to stand - you need to improve it.`;
      }
      if (actualBestAction === 'double-down') {
        return `This is a DOUBLE DOWN opportunity, not a stand. With ${total}, you have a strong starting hand but it's not complete yet. Doubling gets you one more card while maximizing your bet.`;
      }
      return `Standing is best with 17+ or against weak dealers (4-6) when you have 12-16. This situation calls for a different strategy.`;
    
    case 'split':
      if (actualBestAction === 'stand') {
        return `With a pair totaling ${total}, you should STAND, not split! Splitting is good for pairs of 8s and Aces, but NOT for 10s (10-K-Q-J). You already have 20, which is an excellent hand. Splitting would break up a winner.`;
      }
      if (actualBestAction === 'hit') {
        return `While you have a pair, this isn't a split situation. Split when you have pairs of 8s (escape 16) or Aces (maximize two strong hands). This pair is better played differently.`;
      }
      return `Splitting works best with pairs of 8s (to escape 16) and Aces (two chances at 21). Not all pairs should be split - especially avoid splitting 10s!`;
    
    default:
      return '';
  }
}
