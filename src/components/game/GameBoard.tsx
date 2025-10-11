import React, { useState } from 'react';
import { GameState, PlayerAction } from '../../types/game';
import { Hand } from './Hand';
import { Button } from '../ui/Button';
import { useBlackjackStrategy } from '../../hooks/useBlackjackStrategy';
import { StrategyGrid } from './StrategyGrid';
import './GameBoard.css';

interface GameBoardProps {
  gameState: GameState;
  onPlayerAction: (action: PlayerAction) => void;
  onDealerPlay: () => void;
  onDeal: () => void;
  showStrategyHints?: boolean;
}

export function GameBoard({
  gameState,
  onPlayerAction,
  onDealerPlay,
  onDeal,
  showStrategyHints = true,
}: GameBoardProps) {
  const dealerUpcard = gameState.dealerHand.cards[0] || null;
  const strategy = useBlackjackStrategy(gameState.playerHand, dealerUpcard);
  
  const canMakePlayerAction = gameState.phase === 'player-turn' && !gameState.playerHand.isBusted;
  const canStartDealerPlay = gameState.phase === 'dealer-turn';
  const isGameOver = gameState.phase === 'game-over';
  
  const getGameResultMessage = () => {
    if (!gameState.result) return '';
    
    switch (gameState.result) {
      case 'player-wins':
        return 'You Win!';
      case 'player-blackjack':
        return 'Blackjack! You Win!';
      case 'dealer-wins':
        return 'Dealer Wins';
      case 'dealer-blackjack':
        return 'Dealer Blackjack!';
      case 'push':
        return 'Push - It\'s a tie!';
      default:
        return '';
    }
  };
  
  const getResultColor = () => {
    switch (gameState.result) {
      case 'player-wins':
      case 'player-blackjack':
        return 'success';
      case 'dealer-wins':
      case 'dealer-blackjack':
        return 'danger';
      case 'push':
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  
  const [showStrategyGrid, setShowStrategyGrid] = useState(false);

  return (
    <div className="game-board">
      <div className="game-info">
        <div className="game-balance">
          Balance: ${gameState.playerScore}
        </div>
        <div className="game-bet">
          Current Bet: ${gameState.currentBet}
        </div>
        <div className="game-phase">
          Phase: {gameState.phase.replace('-', ' ').toUpperCase()}
        </div>
      </div>
      
      <div className="game-hands">
        <Hand
          hand={gameState.dealerHand}
          title="Dealer"
          isDealer={true}
          showTotal={gameState.phase === 'game-over' || gameState.phase === 'dealer-turn'}
          hideHoleCard={gameState.phase === 'player-turn' || gameState.phase === 'betting'}
        />
        
        {gameState.isSplit ? (
          <div className="split-hands-container">
            {gameState.splitHands.map((splitHand, index) => (
              <div
                key={index}
                className={`split-hand-wrapper ${
                  index === gameState.activeSplitHandIndex && gameState.phase === 'player-turn'
                    ? 'active-hand'
                    : ''
                } ${splitHand.isComplete ? 'completed-hand' : ''}`}
              >
                <Hand
                  hand={splitHand.hand}
                  title={`Hand ${index + 1}${
                    index === gameState.activeSplitHandIndex && gameState.phase === 'player-turn'
                      ? ' (Active)'
                      : ''
                  }`}
                  isDealer={false}
                  showTotal={true}
                />
                {splitHand.result && (
                  <div className={`split-hand-result result-${splitHand.result}`}>
                    {splitHand.result === 'player-wins' && '✓ Win'}
                    {splitHand.result === 'dealer-wins' && '✗ Lose'}
                    {splitHand.result === 'push' && '= Push'}
                    {splitHand.result === 'player-blackjack' && '★ Blackjack!'}
                  </div>
                )}
                <div className="split-hand-bet">Bet: ${splitHand.bet}</div>
              </div>
            ))}
          </div>
        ) : (
          <Hand
            hand={gameState.playerHand}
            title="Player"
            isDealer={false}
            showTotal={true}
          />
        )}
      </div>
      
      {showStrategyHints && canMakePlayerAction && strategy.primaryRecommendation && (
        <div className="strategy-hint">
          <div className="strategy-hint-title">Strategy Hint:</div>
          <div className="strategy-hint-action">
            {strategy.primaryRecommendation.action.replace('-', ' ').toUpperCase()}
          </div>
          <div className="strategy-hint-reasoning">
            {strategy.primaryRecommendation.reasoning}
          </div>
        </div>
      )}
      
      <div className="game-actions">
        {canMakePlayerAction && (
          <div className="player-actions">
            <Button
              variant="primary"
              onClick={() => onPlayerAction('hit')}
              disabled={gameState.playerHand.isBusted}
            >
              Hit
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => onPlayerAction('stand')}
            >
              Stand
            </Button>
            
            {gameState.canDoubleDown && (
              <Button
                variant="success"
                onClick={() => onPlayerAction('double-down')}
                disabled={gameState.playerScore < gameState.currentBet}
              >
                Double Down
              </Button>
            )}
            
            {gameState.canSplit && (
              <Button
                variant="success"
                onClick={() => onPlayerAction('split')}
                disabled={gameState.playerScore < gameState.currentBet}
              >
                Split
              </Button>
            )}
            
            {gameState.canSurrender && (
              <Button
                variant="danger"
                onClick={() => onPlayerAction('surrender')}
              >
                Surrender
              </Button>
            )}
            
            {gameState.canTakeInsurance && (
              <Button
                variant="secondary"
                onClick={() => onPlayerAction('insurance')}
              >
                Insurance
              </Button>
            )}
          </div>
        )}
        
        {/* Dealer play is now automatic */}
        
        {isGameOver && (
          <div className="game-over-actions">
            <div className={`game-result game-result--${getResultColor()}`}>
              {getGameResultMessage()}
            </div>
            <Button
              variant="primary"
              onClick={onDeal}
            >
              Deal
            </Button>
          </div>
        )}
        
        {/* Fallback for unexpected states */}
        {!canMakePlayerAction && !canStartDealerPlay && !isGameOver && (
          <div className="game-loading">
            <p>Processing...</p>
            <Button
              variant="secondary"
              onClick={onDeal}
            >
              Deal
            </Button>
          </div>
        )}
      </div>
      
      <StrategyGrid
        isOpen={showStrategyGrid}
        onClose={() => setShowStrategyGrid(false)}
      />
    </div>
  );
}
