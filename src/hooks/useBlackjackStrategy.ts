import { useMemo } from 'react';
import { Hand, Card } from '../types/card';
import { StrategyRecommendation } from '../types/game';
import { 
  getBasicStrategyRecommendation, 
  getDoubleDownRecommendation, 
  getSurrenderRecommendation, 
  getInsuranceRecommendation,
  getAllStrategyRecommendations 
} from '../utils/strategy';

export function useBlackjackStrategy(playerHand: Hand, dealerUpcard: Card | null) {
  const recommendations = useMemo(() => {
    if (!dealerUpcard || playerHand.cards.length === 0) {
      return [];
    }
    
    return getAllStrategyRecommendations(playerHand, dealerUpcard);
  }, [playerHand, dealerUpcard]);
  
  const primaryRecommendation = useMemo(() => {
    if (recommendations.length === 0) return null;
    
    // Find the recommendation with the highest confidence
    return recommendations.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
  }, [recommendations]);
  
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
