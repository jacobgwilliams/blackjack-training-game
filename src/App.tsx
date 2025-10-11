import { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { GameBoard } from './components/game/GameBoard';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { ConfirmModal } from './components/ui/ConfirmModal';
import { StrategyGrid } from './components/game/StrategyGrid';
import { useGameState } from './hooks/useGameState';
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
  const [showAbout, setShowAbout] = useState(false);
  const [showStrategyHints, setShowStrategyHints] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetStatsConfirm, setShowResetStatsConfirm] = useState(false);
  const [debugScenario, setDebugScenario] = useState<'none' | 'double-down' | 'hit' | 'stand' | 'split'>('none');
  const [shoeSize, setShoeSize] = useState<number>(6);
  
  // Apply settings (memoized to avoid unnecessary recreations)
  const gameSettings = useMemo(() => ({
    ...DEFAULT_GAME_SETTINGS,
    shoeSize,
    debugMode: {
      enabled: debugScenario !== 'none',
      scenario: debugScenario,
    },
  }), [debugScenario, shoeSize]);
  
  const { gameState, statistics, actions } = useGameState(gameSettings);
  const lastProcessedResult = useRef<string | null>(null);
  
  // Initialize game on mount
  useEffect(() => {
    actions.initializeNewGame();
  }, []); // Empty dependency array - only run once on mount
  
  // Update statistics when game ends
  useEffect(() => {
    // Only update statistics once per game by tracking the result
    if (gameState.phase === 'game-over' && gameState.result && gameState.result !== lastProcessedResult.current) {
      lastProcessedResult.current = gameState.result;
      actions.updateStatistics(gameState.result);
    }
    
    // Reset the ref when a new game starts
    if (gameState.phase === 'betting') {
      lastProcessedResult.current = null;
    }
  }, [gameState.phase, gameState.result]);
  
  // Automatically play dealer hand when phase changes to dealer-turn
  useEffect(() => {
    if (gameState.phase === 'dealer-turn') {
      // Small delay for animation/visual feedback
      const timer = setTimeout(() => {
        actions.dealerPlay();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.phase]);
  
  const handlePlayerAction = async (action: string) => {
    try {
      console.log('Player action:', action, 'Current game state:', gameState);
      actions.playerAction(action as PlayerAction);
      
      // Note: Dealer play is now handled by useEffect watching for phase change
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
  
  const handleResetGameClick = () => {
    setShowResetConfirm(true);
  };
  
  const handleConfirmResetGame = () => {
    try {
      console.log('Reset game - resetting balance to starting amount');
      actions.newGame(); // This resets the balance
      setShowResetConfirm(false);
    } catch (error) {
      console.error('Error in new game:', error);
      setShowResetConfirm(false);
    }
  };
  
  const handleResetStatsClick = () => {
    setShowResetStatsConfirm(true);
  };
  
  const handleConfirmResetStats = () => {
    try {
      console.log('Reset statistics');
      actions.resetStatistics();
      setShowResetStatsConfirm(false);
    } catch (error) {
      console.error('Error resetting statistics:', error);
      setShowResetStatsConfirm(false);
    }
  };
  
  const handleDeal = () => {
    try {
      console.log('Deal - starting new hand with current balance');
      actions.initializeNewGame(); // This preserves the balance
    } catch (error) {
      console.error('Error in deal:', error);
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
        onResetGame={handleResetGameClick}
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
            onDeal={handleDeal}
            showStrategyHints={showStrategyHints}
            trainingScenario={debugScenario}
          />
        )}
      </main>
      
      <Footer 
        onShowRules={() => setShowRules(true)}
        onShowStrategy={() => setShowStrategyGuide(true)}
        onShowHelp={() => setShowHelp(true)}
        onShowAbout={() => setShowAbout(true)}
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
          </ul>
          
          <h3>Dealer Rules</h3>
          <p>The dealer has no choices - they must follow fixed rules:</p>
          <ul>
            <li><strong>Must Hit on 16 or less:</strong> The dealer is required to take another card when their total is 16 or lower</li>
            <li><strong>Must Stand on 17 or higher:</strong> The dealer must stop taking cards once they reach 17 or more</li>
            <li><strong>Hits on Soft 17:</strong> If the dealer has a soft 17 (Ace counting as 11 + 6), they must take another card</li>
            <li>This is why weak dealer cards (4, 5, 6) give you an advantage - the dealer is more likely to bust when forced to hit</li>
          </ul>
          
          <h3>Special Actions</h3>
          <ul>
            <li><strong>Double Down:</strong> Double your bet and take exactly one more card. Available only on your first two cards. Best with totals of 9, 10, or 11, especially when the dealer shows a weak card (2-6). You cannot hit after doubling down.</li>
            
            <li><strong>Split:</strong> When you have a pair, you can split them into two separate hands by placing an equal bet. Each hand is played independently. Always split Aces and 8s. Never split 10s, 5s, or 4s. You can usually split up to 3 times (4 hands total).</li>
            
            <li><strong>Surrender:</strong> Give up half your bet and end the hand early. Available only on your first two cards. Use when you have a weak hand (like 15 or 16) against a strong dealer card (9, 10, or Ace). This reduces your losses compared to playing out a likely losing hand.</li>
            
            <li><strong>Insurance:</strong> A side bet offered when the dealer shows an Ace. You bet half your original bet that the dealer has blackjack. If the dealer has blackjack, insurance pays 2:1, but you lose your original bet. If not, you lose the insurance bet but continue with your original hand. Generally not recommended due to high house edge.</li>
          </ul>
          
          <h3>Casino Hand Signals</h3>
          <p>At a real casino table, you use hand gestures to communicate your decisions:</p>
          <ul>
            <li><strong>Hit:</strong> Tap the table with your finger or wave your hand toward yourself</li>
            <li><strong>Stand:</strong> Wave your hand horizontally over your cards (palm down)</li>
            <li><strong>Double Down:</strong> Place an additional bet next to your original bet, then point with one finger</li>
            <li><strong>Split:</strong> Place an equal bet next to your original bet, then make a "V" gesture with two fingers</li>
            <li><strong>Surrender:</strong> Draw a line behind your bet with your finger (like crossing it out)</li>
            <li><strong>Insurance:</strong> Place your insurance bet in the insurance box and say "insurance"</li>
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
          <div className="statistics-footer">
            <Button
              variant="danger"
              onClick={handleResetStatsClick}
            >
              Reset Statistics
            </Button>
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
          <h3>Game Settings</h3>
          <div className="setting-item">
            <p style={{ fontSize: '0.75rem', color: '#fbbf24', marginBottom: '1rem', fontStyle: 'italic' }}>
              ⚠️ Note: Changing shoe size will shuffle the entire deck and start a new game.
            </p>
            <label className="setting-label">
              <span className="setting-text">
                <strong>Shoe Size (Number of Decks)</strong>
                <br />
                <small>Standard casino uses 6 decks. Range: 1-8 decks</small>
              </span>
            </label>
            <select 
              value={shoeSize} 
              onChange={(e) => setShoeSize(parseInt(e.target.value))}
              className="setting-select"
            >
              <option value="1">1 Deck</option>
              <option value="2">2 Decks</option>
              <option value="4">4 Decks</option>
              <option value="6">6 Decks (Standard)</option>
              <option value="8">8 Decks</option>
            </select>
          </div>
          
          <h3>Training/Debug Options</h3>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
            Force specific scenarios to practice optimal play. Select one option at a time:
          </p>
          <p style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '1rem', fontStyle: 'italic' }}>
            ⚠️ Note: Practice modes search through the shoe for specific cards, which affects card order and counts.
            Use Normal Play mode for realistic gameplay.
          </p>
          
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="radio"
                name="debugScenario"
                checked={debugScenario === 'none'}
                onChange={() => setDebugScenario('none')}
              />
              <span className="setting-text">
                <strong>Normal Play</strong> - Random cards
              </span>
            </label>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="radio"
                name="debugScenario"
                checked={debugScenario === 'double-down'}
                onChange={() => setDebugScenario('double-down')}
              />
              <span className="setting-text">
                <strong>Double Down Practice</strong> - Get 11 vs dealer 5/6
              </span>
            </label>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="radio"
                name="debugScenario"
                checked={debugScenario === 'hit'}
                onChange={() => setDebugScenario('hit')}
              />
              <span className="setting-text">
                <strong>Hit Practice</strong> - Get 14 vs dealer 10
              </span>
            </label>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="radio"
                name="debugScenario"
                checked={debugScenario === 'stand'}
                onChange={() => setDebugScenario('stand')}
              />
              <span className="setting-text">
                <strong>Stand Practice</strong> - Get 18 (strong hand)
              </span>
            </label>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="radio"
                name="debugScenario"
                checked={debugScenario === 'split'}
                onChange={() => setDebugScenario('split')}
              />
              <span className="setting-text">
                <strong>Split Practice</strong> - Always deal a pair
              </span>
            </label>
          </div>
          
          {debugScenario !== 'none' && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              background: 'rgba(59, 130, 246, 0.1)', 
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: '#3b82f6'
            }}>
              ℹ️ Training mode active! Place a new bet to practice the selected scenario.
            </div>
          )}
          
          <h3>Strategy Hints</h3>
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={showStrategyHints}
                onChange={(e) => setShowStrategyHints(e.target.checked)}
              />
              <span className="setting-text">
                <strong>Show Strategy Hints</strong>
                <br />
                <small>Display optimal play recommendations during the game</small>
              </span>
            </label>
          </div>
          
          <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
            Additional settings will be available in future updates.
          </p>
        </div>
      </Modal>

      {/* Strategy Guide Modal */}
      <Modal
        isOpen={showStrategyGuide}
        onClose={() => setShowStrategyGuide(false)}
        title="Basic Strategy Guide"
      >
        <div className="strategy-content">
          <h3>Basic Strategy Tips</h3>
          <ul>
            <li><strong>Always split Aces and 8s</strong> - These are the most profitable splits</li>
            <li><strong>Never split 10s, 5s, or 4s</strong> - These hands are better played as totals</li>
            <li><strong>Double down on 11 vs dealer 2-10</strong> - High probability of improvement</li>
            <li><strong>Double down on 10 vs dealer 2-9</strong> - Strong double down opportunity</li>
            <li><strong>Double down on 9 vs dealer 3-6</strong> - Good double down spot</li>
            <li><strong>Never take insurance</strong> - The house edge is too high</li>
            <li><strong>Surrender 16 vs dealer 9 or 10</strong> - Cut your losses on weak hands</li>
            <li><strong>Surrender 15 vs dealer 10</strong> - Another good surrender spot</li>
            <li><strong>Hit soft 17 and below</strong> - You can't bust with a soft hand</li>
            <li><strong>Stand on hard 17 and above</strong> - High risk of busting</li>
          </ul>
          
          <h3>Hard Totals Strategy</h3>
          <p>For hard totals (no Ace or Ace counted as 1):</p>
          <ul>
            <li>5-8: Always hit</li>
            <li>9: Double vs dealer 3-6, otherwise hit</li>
            <li>10: Double vs dealer 2-9, hit vs dealer 10 or A</li>
            <li>11: Double vs dealer 2-10, hit vs dealer A</li>
            <li>12: Stand vs dealer 4-6, hit vs dealer 2-3, 7-A</li>
            <li>13-16: Stand vs dealer 2-6, hit vs dealer 7-A</li>
            <li>17-21: Always stand</li>
          </ul>
          
          <h3>Soft Totals Strategy</h3>
          <p>For soft totals (Ace counted as 11):</p>
          <ul>
            <li>A,2 or A,3 (13-14): Double vs dealer 5-6, otherwise hit</li>
            <li>A,4 or A,5 (15-16): Double vs dealer 4-6, otherwise hit</li>
            <li>A,6 (17): Double vs dealer 3-6, otherwise hit</li>
            <li>A,7 (18): Double vs dealer 2-6, stand vs dealer 7-8, hit vs dealer 9-A</li>
            <li>A,8 or A,9 (19-20): Always stand</li>
            <li>A,10 (21): Blackjack! Automatic win (pays 3:2)</li>
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
      
      {/* About Modal */}
      <Modal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title="About Blackjack Training Game"
      >
        <div className="about-content">
          <h3>What This Is All About</h3>
          <p>
            I built this app because I wanted to help people actually understand blackjack 
            instead of just winging it at the casino. You know how it is - you sit down 
            at a table, get dealt some cards, and suddenly you're making decisions that 
            could cost you money without really knowing why.
          </p>
          <p>
            This tool teaches you the patterns that exist in blackjack and helps you build 
            confidence so when you're in a real casino setting, you're not just guessing. 
            It's like having a patient teacher who never gets tired of explaining the same 
            concept over and over.
          </p>
          
          <h3>What You'll Actually Learn</h3>
          <ul>
            <li><strong>Basic Strategy:</strong> The math behind every decision - no more guessing</li>
            <li><strong>Pattern Recognition:</strong> You'll start seeing when to hit, stand, double down, or split without thinking too hard</li>
            <li><strong>Smart Risk Management:</strong> When insurance is actually worth it (spoiler: usually it's not)</li>
            <li><strong>Real Confidence:</strong> Practice without losing real money, so you're ready when you are</li>
          </ul>
          
          <h3>Cool Stuff This App Does</h3>
          <ul>
            <li>Gives you strategy hints in real-time with explanations that actually make sense</li>
            <li>Training modes that focus on specific scenarios you'll actually encounter</li>
            <li>Tracks your stats so you can see yourself getting better over time</li>
            <li>Full split hand functionality - because splitting can be confusing as hell</li>
            <li>Works on your phone, tablet, or computer - practice anywhere</li>
          </ul>
          
          <h3>Found a Bug? Have an Idea?</h3>
          <p>
            This thing is a work in progress, and I'm always looking to make it better. 
            If you find something broken or have a cool idea for a new feature, 
            definitely let me know!
          </p>
          <p>
            <a 
              href="https://github.com/jacobgwilliams/blackjack-training-game/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-issues-link"
            >
              🐛 Report Issues & Ideas →
            </a>
          </p>
          
          <h3>Play Responsibly</h3>
          <p>
            This is a training tool, not a money-making machine. Always gamble responsibly 
            and within your means. If you or someone you know has a gambling problem, 
            please get help from the right people.
          </p>
        </div>
      </Modal>
      
      {/* Reset Game Confirmation */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Game?"
        message="Are you sure you want to reset the game? Your current balance will be reset to $1000. Your statistics will be preserved."
        confirmText="Reset Game"
        cancelText="Cancel"
        variant="warning"
        onConfirm={handleConfirmResetGame}
        onCancel={() => setShowResetConfirm(false)}
      />
      
      {/* Reset Statistics Confirmation */}
      <ConfirmModal
        isOpen={showResetStatsConfirm}
        title="Reset Statistics?"
        message="Are you sure you want to reset all your statistics? This action cannot be undone. Your current balance will not be affected."
        confirmText="Reset Statistics"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmResetStats}
        onCancel={() => setShowResetStatsConfirm(false)}
      />
    </div>
  );
}

export default App;
