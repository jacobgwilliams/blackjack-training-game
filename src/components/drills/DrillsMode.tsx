import { useState, useEffect } from 'react';
import { Card, Hand, Suit, Rank } from '../../types/card';
import { getBasicStrategyRecommendation } from '../../utils/strategy';
import { Button } from '../ui/Button';
import './DrillsMode.css';

interface DrillsModeProps {
  onExitDrills: () => void;
}

interface DrillScenario {
  playerHand: Hand;
  dealerUpcard: Card;
  correctAction: string;
  explanation: string;
}

export function DrillsMode({ onExitDrills }: DrillsModeProps) {
  const [currentScenario, setCurrentScenario] = useState<DrillScenario | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  // Generate a random scenario
  const generateScenario = (): DrillScenario => {
    // For now, let's create some basic scenarios
    // We'll expand this to be more comprehensive
    const scenarios = [
      {
        playerHand: { 
          cards: [
            { rank: 'A' as Rank, suit: 'hearts' as Suit, value: 11, displayValue: 'A' }, 
            { rank: '7' as Rank, suit: 'spades' as Suit, value: 7, displayValue: '7' }
          ], 
          total: 18, 
          isSoft: true, 
          isBlackjack: false, 
          isBusted: false 
        },
        dealerUpcard: { rank: '6' as Rank, suit: 'diamonds' as Suit, value: 6, displayValue: '6' },
      },
      {
        playerHand: { 
          cards: [
            { rank: '10' as Rank, suit: 'hearts' as Suit, value: 10, displayValue: '10' }, 
            { rank: '6' as Rank, suit: 'spades' as Suit, value: 6, displayValue: '6' }
          ], 
          total: 16, 
          isSoft: false, 
          isBlackjack: false, 
          isBusted: false 
        },
        dealerUpcard: { rank: '10' as Rank, suit: 'diamonds' as Suit, value: 10, displayValue: '10' },
      },
      {
        playerHand: { 
          cards: [
            { rank: '8' as Rank, suit: 'hearts' as Suit, value: 8, displayValue: '8' }, 
            { rank: '8' as Rank, suit: 'spades' as Suit, value: 8, displayValue: '8' }
          ], 
          total: 16, 
          isSoft: false, 
          isBlackjack: false, 
          isBusted: false 
        },
        dealerUpcard: { rank: '9' as Rank, suit: 'diamonds' as Suit, value: 9, displayValue: '9' },
      },
      {
        playerHand: { 
          cards: [
            { rank: 'A' as Rank, suit: 'hearts' as Suit, value: 11, displayValue: 'A' }, 
            { rank: '2' as Rank, suit: 'spades' as Suit, value: 2, displayValue: '2' }
          ], 
          total: 13, 
          isSoft: true, 
          isBlackjack: false, 
          isBusted: false 
        },
        dealerUpcard: { rank: '5' as Rank, suit: 'diamonds' as Suit, value: 5, displayValue: '5' },
      },
      {
        playerHand: { 
          cards: [
            { rank: '9' as Rank, suit: 'hearts' as Suit, value: 9, displayValue: '9' }, 
            { rank: '2' as Rank, suit: 'spades' as Suit, value: 2, displayValue: '2' }
          ], 
          total: 11, 
          isSoft: false, 
          isBlackjack: false, 
          isBusted: false 
        },
        dealerUpcard: { rank: '6' as Rank, suit: 'diamonds' as Suit, value: 6, displayValue: '6' },
      },
    ];

    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Get the correct strategy recommendation
    const recommendation = getBasicStrategyRecommendation(randomScenario.playerHand, randomScenario.dealerUpcard);
    
    return {
      playerHand: randomScenario.playerHand,
      dealerUpcard: randomScenario.dealerUpcard,
      correctAction: recommendation.action,
      explanation: recommendation.reasoning,
    };
  };

  // Start a new scenario
  const startNewScenario = () => {
    const scenario = generateScenario();
    setCurrentScenario(scenario);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // Handle answer selection
  const handleAnswerSelect = (action: string) => {
    if (showResult) return;
    
    setSelectedAnswer(action);
    setShowResult(true);
    
    const isCorrect = action === currentScenario?.correctAction;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    
    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  // Initialize with first scenario
  useEffect(() => {
    startNewScenario();
  }, []);

  if (!currentScenario) {
    return <div>Loading...</div>;
  }

  const actions = ['hit', 'stand', 'double-down', 'split'];
  const actionLabels = {
    'hit': 'Hit',
    'stand': 'Stand', 
    'double-down': 'Double Down',
    'split': 'Split'
  };

  return (
    <div className="drills-mode">
      <div className="drills-header">
        <h2>🎯 Drills Mode</h2>
        <div className="drills-stats">
          <div className="drills-score">
            Score: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
          </div>
          {streak > 0 && (
            <div className="drills-streak">
              🔥 {streak} streak!
            </div>
          )}
        </div>
      </div>

      <div className="drills-scenario">
        <div className="scenario-cards">
          <div className="player-cards">
            <h3>Your Hand:</h3>
            <div className="cards-display">
              {currentScenario.playerHand.cards.map((card: Card, index: number) => (
                <div key={index} className="card">
                  {card.displayValue}{card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : card.suit === 'clubs' ? '♣' : '♠'}
                </div>
              ))}
            </div>
            <div className="hand-total">
              Total: {currentScenario.playerHand.total} {currentScenario.playerHand.isSoft && '(Soft)'}
            </div>
          </div>

          <div className="dealer-card">
            <h3>Dealer Shows:</h3>
            <div className="card">
              {currentScenario.dealerUpcard.displayValue}{currentScenario.dealerUpcard.suit === 'hearts' ? '♥' : currentScenario.dealerUpcard.suit === 'diamonds' ? '♦' : currentScenario.dealerUpcard.suit === 'clubs' ? '♣' : '♠'}
            </div>
          </div>
        </div>

        <div className="scenario-question">
          <h3>What's the correct play?</h3>
        </div>

        <div className="answer-options">
          {actions.map((action) => (
            <Button
              key={action}
              variant={
                showResult 
                  ? action === currentScenario.correctAction 
                    ? "success" 
                    : selectedAnswer === action 
                      ? "danger" 
                      : "secondary"
                  : selectedAnswer === action 
                    ? "primary" 
                    : "secondary"
              }
              onClick={() => handleAnswerSelect(action)}
              className="answer-button"
              disabled={showResult}
            >
              {actionLabels[action as keyof typeof actionLabels]}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className="result-feedback">
            <div className={`result-message ${selectedAnswer === currentScenario.correctAction ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === currentScenario.correctAction ? '✅ Correct!' : '❌ Incorrect!'}
            </div>
            <div className="explanation">
              <strong>Correct answer:</strong> {actionLabels[currentScenario.correctAction as keyof typeof actionLabels]}
            </div>
            <div className="explanation-text">
              {currentScenario.explanation}
            </div>
            <Button
              variant="primary"
              onClick={startNewScenario}
              className="next-scenario-button"
            >
              Next Scenario →
            </Button>
          </div>
        )}
      </div>

      <div className="drills-controls">
        <Button
          variant="secondary"
          onClick={onExitDrills}
          className="exit-drills-button"
        >
          Exit Drills
        </Button>
      </div>
    </div>
  );
}
