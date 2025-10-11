import { useState, useEffect, useMemo } from 'react';
import { Card, Hand } from '../../types/card';
import { generateAllScenarios, getRandomScenario, DrillScenario } from '../../utils/scenarioGenerator';
import { Button } from '../ui/Button';
import './DrillsMode.css';

interface DrillsModeProps {
  onExitDrills: () => void;
}

export function DrillsMode({ onExitDrills }: DrillsModeProps) {
  const [currentScenario, setCurrentScenario] = useState<DrillScenario | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  // Generate all possible scenarios once when component mounts
  const allScenarios = useMemo(() => {
    return generateAllScenarios();
  }, []);

  // Generate a random scenario from our comprehensive list
  const generateScenario = (): DrillScenario => {
    return getRandomScenario(allScenarios);
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
          <div className="scenario-category">
            {currentScenario.category === 'hard-total' && '🔢 Hard Total'}
            {currentScenario.category === 'soft-total' && '🃏 Soft Total'}
            {currentScenario.category === 'pair' && '👥 Pair'}
            {currentScenario.category === 'blackjack' && '🎯 Blackjack'}
          </div>
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
