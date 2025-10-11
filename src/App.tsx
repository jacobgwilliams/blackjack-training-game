import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { GameBoard } from './components/game/GameBoard';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { StrategyGrid } from './components/game/StrategyGrid';
import { useGameState } from './hooks/useGameState';
import { useStatistics } from './hooks/useStatistics';
import { DEFAULT_GAME_SETTINGS } from './constants/gameRules';
import { PlayerAction } from './types/game';
import './App.css';

function App() {
  const [showRules, setShowRules] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStrategyGrid, setShowStrategyGrid] = useState(false);
  const [showStrategyGuide, setShowStrategyGuide] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showStrategyHints, setShowStrategyHints] = useState(true);
  
  const { gameState, settings, statistics, actions } = useGameState(DEFAULT_GAME_SETTINGS);
  const { updateGameResult, updateBalance, updateHandStats } = useStatistics();
  
  // Initialize game on mount
  useEffect(() => {
    actions.initializeNewGame();
  }, []); // Empty dependency array - only run once on mount
  
  // Update statistics when game ends
  useEffect(() => {
    if (gameState.phase === 'game-over' && gameState.result) {
      updateGameResult(gameState.result, gameState.currentBet);
      updateBalance(gameState.playerScore);
      updateHandStats(
        gameState.playerHand.total,
        gameState.playerHand.isBlackjack,
        gameState.playerHand.isBusted
      );
    }
  }, [gameState.phase, gameState.result, gameState.currentBet, gameState.playerScore, gameState.playerHand, updateGameResult, updateBalance, updateHandStats]);
  
  const handlePlayerAction = async (action: string) => {
    try {
      console.log('Player action:', action, 'Current game state:', gameState);
      actions.playerAction(action as PlayerAction);
      
      // If player stands, automatically play dealer hand with animation
      if (action === 'stand') {
        // Wait for state update
        await new Promise(resolve => setTimeout(resolve, 500));
        actions.dealerPlay();
      }
    } catch (error) {
      console.error('Error in player action:', error);
      // Reset to betting phase on error
      actions.newGame();
    }
  };
  
  const handleDealerPlay = () => {
    try {
      console.log('Dealer play - Current game state:', gameState);
      actions.dealerPlay();
    } catch (error) {
      console.error('Error in dealer play:', error);
      actions.newGame();
    }
  };
  
  const handleNewGame = () => {
    try {
      console.log('New game');
      actions.newGame();
    } catch (error) {
      console.error('Error in new game:', error);
    }
  };
  
  const handlePlaceBet = (betAmount: number) => {
    try {
      console.log('Placing bet:', betAmount, 'Current game state:', gameState);
      actions.makeBet(betAmount);
      actions.startGame();
    } catch (error) {
      console.error('Error in place bet:', error);
      actions.newGame();
    }
  };
  
  return (
    <div className="app">
      <Header
        onShowRules={() => setShowRules(true)}
        onShowStatistics={() => setShowStatistics(true)}
        onShowSettings={() => setShowSettings(true)}
        onResetGame={handleNewGame}
        onToggleStrategyGrid={() => setShowStrategyGrid(!showStrategyGrid)}
        onToggleStrategyHints={() => setShowStrategyHints(!showStrategyHints)}
        showStrategyHints={showStrategyHints}
        currentBalance={gameState.playerScore}
      />
      
      <main className="app-main">
        {gameState.phase === 'betting' && (
          <div className="betting-screen">
            <div className="betting-content">
              <h2>Place Your Bet</h2>
              <p>Current Balance: ${gameState.playerScore}</p>
              <div className="betting-options">
                <Button
                  variant="primary"
                  onClick={() => handlePlaceBet(10)}
                  disabled={gameState.playerScore < 10}
                >
                  $10
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handlePlaceBet(25)}
                  disabled={gameState.playerScore < 25}
                >
                  $25
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handlePlaceBet(50)}
                  disabled={gameState.playerScore < 50}
                >
                  $50
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handlePlaceBet(100)}
                  disabled={gameState.playerScore < 100}
                >
                  $100
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {(gameState.phase === 'dealing' || gameState.phase === 'player-turn' || 
          gameState.phase === 'dealer-turn' || gameState.phase === 'game-over') && (
          <GameBoard
            gameState={gameState}
            onPlayerAction={handlePlayerAction}
            onDealerPlay={handleDealerPlay}
            onDeal={handleNewGame}
            showStrategyHints={showStrategyHints}
          />
        )}
      </main>
      
      <Footer 
        onShowRules={() => setShowRules(true)}
        onShowStrategy={() => setShowStrategyGuide(true)}
        onShowHelp={() => setShowHelp(true)}
      />
      
      <StrategyGrid
        isOpen={showStrategyGrid}
        onClose={() => setShowStrategyGrid(false)}
      />
      
      {/* Rules Modal */}
      <Modal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        title="Blackjack Rules"
      >
        <div className="rules-content">
          <h3>Objective</h3>
          <p>Get as close to 21 as possible without going over. Beat the dealer's hand.</p>
          
          <h3>Card Values</h3>
          <ul>
            <li>Number cards (2-10): Face value</li>
            <li>Face cards (J, Q, K): 10 points</li>
            <li>Ace: 1 or 11 points (whichever is better)</li>
          </ul>
          
          <h3>Gameplay</h3>
          <ul>
            <li>Place your bet</li>
            <li>Receive two cards face up</li>
            <li>Dealer gets one card face up, one face down</li>
            <li>Hit to take another card, or Stand to keep your hand</li>
            <li>Dealer must hit on 16, stand on 17</li>
          </ul>
          
          <h3>Special Actions</h3>
          <ul>
            <li><strong>Double Down:</strong> Double your bet and take exactly one more card</li>
            <li><strong>Split:</strong> Split pairs into two separate hands</li>
            <li><strong>Surrender:</strong> Give up half your bet and end the hand</li>
            <li><strong>Insurance:</strong> Side bet against dealer blackjack</li>
          </ul>
          
          <h3>Winning</h3>
          <ul>
            <li>Blackjack (21 with first two cards): 3:2 payout</li>
            <li>Beat dealer without busting: 1:1 payout</li>
            <li>Tie (push): Return your bet</li>
            <li>Bust (over 21): Lose your bet</li>
          </ul>
        </div>
      </Modal>
      
      {/* Statistics Modal */}
      <Modal
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
        title="Game Statistics"
      >
        <div className="statistics-content">
          <div className="statistics-grid">
            <div className="statistic-item">
              <div className="statistic-label">Games Played</div>
              <div className="statistic-value">{statistics.gamesPlayed}</div>
            </div>
            <div className="statistic-item">
              <div className="statistic-label">Games Won</div>
              <div className="statistic-value">{statistics.gamesWon}</div>
            </div>
            <div className="statistic-item">
              <div className="statistic-label">Games Lost</div>
              <div className="statistic-value">{statistics.gamesLost}</div>
            </div>
            <div className="statistic-item">
              <div className="statistic-label">Games Pushed</div>
              <div className="statistic-value">{statistics.gamesPushed}</div>
            </div>
            <div className="statistic-item">
              <div className="statistic-label">Win Rate</div>
              <div className="statistic-value">
                {statistics.gamesPlayed > 0 
                  ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
                  : 0}%
              </div>
            </div>
            <div className="statistic-item">
              <div className="statistic-label">Blackjacks</div>
              <div className="statistic-value">{statistics.blackjacks}</div>
            </div>
            <div className="statistic-item">
              <div className="statistic-label">Busts</div>
              <div className="statistic-value">{statistics.busts}</div>
            </div>
            <div className="statistic-item">
              <div className="statistic-label">Total Winnings</div>
              <div className="statistic-value">
                ${statistics.totalWinnings > 0 ? '+' : ''}{statistics.totalWinnings}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      
      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Game Settings"
      >
        <div className="settings-content">
          <p>Settings will be available in a future update.</p>
        </div>
      </Modal>

      {/* Strategy Guide Modal */}
      <Modal
        isOpen={showStrategyGuide}
        onClose={() => setShowStrategyGuide(false)}
        title="Basic Strategy Guide"
      >
        <div className="strategy-guide-content">
          <h3>Basic Strategy Tips</h3>
          <ul>
            <li><strong>Always split Aces and 8s</strong> - These are the most profitable splits</li>
            <li><strong>Never split 10s, 5s, or 4s</strong> - These hands are better played as totals</li>
            <li><strong>Double down on 11 vs dealer 2-10</strong> - High probability of improvement</li>
            <li><strong>Double down on 10 vs dealer 2-9</strong> - Strong double down opportunity</li>
            <li><strong>Double down on 9 vs dealer 3-6</strong> - Good double down spot</li>
            <li><strong>Never take insurance</strong> - The house edge is too high</li>
            <li><strong>Surrender 16 vs dealer 9, 10, or Ace</strong> - Cut your losses</li>
            <li><strong>Surrender 15 vs dealer 10</strong> - Another good surrender spot</li>
            <li><strong>Hit soft 17 and below</strong> - You can't bust with a soft hand</li>
            <li><strong>Stand on hard 17 and above</strong> - High risk of busting</li>
          </ul>
          
          <h3>Hard Totals Strategy</h3>
          <p>For hard totals (no Ace or Ace counted as 1):</p>
          <ul>
            <li>5-8: Always hit</li>
            <li>9: Hit vs 2-6, double vs 3-6</li>
            <li>10: Hit vs 2-9, double vs 2-9</li>
            <li>11: Hit vs 2-10, double vs 2-10</li>
            <li>12: Stand vs 4-6, hit vs 2-3, 7-10</li>
            <li>13-16: Stand vs 2-6, hit vs 7-10</li>
            <li>17-21: Always stand</li>
          </ul>
          
          <h3>Soft Totals Strategy</h3>
          <p>For soft totals (Ace counted as 11):</p>
          <ul>
            <li>A,2-A,6: Hit vs 2-6, double vs 5-6</li>
            <li>A,7: Stand vs 2-6, hit vs 7-8, double vs 2-6</li>
            <li>A,8-A,9: Always stand</li>
          </ul>
        </div>
      </Modal>
      
      {/* Help Modal */}
      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Help"
      >
        <div className="help-content">
          <h3>How to Play</h3>
          <ol>
            <li>Place your bet by clicking one of the bet amounts</li>
            <li>You'll receive two cards face up</li>
            <li>The dealer gets one card face up, one face down</li>
            <li>Choose your action: Hit, Stand, Double Down, Split, or Surrender</li>
            <li>Get strategy hints to learn optimal play</li>
            <li>Track your statistics to improve your game</li>
          </ol>
          
          <h3>Game Features</h3>
          <ul>
            <li><strong>Strategy Hints:</strong> Get real-time recommendations for optimal play</li>
            <li><strong>Statistics:</strong> Track your performance and improvement</li>
            <li><strong>Training Mode:</strong> Learn basic strategy through practice</li>
            <li><strong>Responsive Design:</strong> Play on desktop, tablet, or mobile</li>
          </ul>
          
          <h3>Tips for Success</h3>
          <ul>
            <li>Follow the strategy hints to learn optimal play</li>
            <li>Practice regularly to improve your skills</li>
            <li>Don't chase losses - stick to your strategy</li>
            <li>Learn when to take insurance and when to surrender</li>
            <li>Understand the difference between hard and soft totals</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
}

export default App;
