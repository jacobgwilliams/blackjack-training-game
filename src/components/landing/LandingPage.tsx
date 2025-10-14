import { Button } from '../ui/Button';
import { PlayerStatistics } from '../../types/game';
import './LandingPage.css';

interface LandingPageProps {
  statistics: PlayerStatistics;
  onStartRun: () => void;
  onViewStatistics: () => void;
}

export function LandingPage({ statistics, onStartRun, onViewStatistics }: LandingPageProps) {
  const lastRun = statistics.runHistory[statistics.runHistory.length - 1];
  const winRate = statistics.gamesPlayed > 0 
    ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
    : 0;

  const formatCurrency = (amount: number) => {
    return amount >= 0 ? `+$${amount}` : `-$${Math.abs(amount)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="welcome-section">
          <h1>Welcome Back!</h1>
          <p className="balance-display">
            Current Balance: <span className="balance-amount">${statistics.currentBalance}</span>
          </p>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-label">Overall Win Rate</div>
            <div className="stat-value">{winRate}%</div>
            <div className="stat-detail">
              {statistics.gamesWon} wins out of {statistics.gamesPlayed} hands
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Total Runs</div>
            <div className="stat-value">{statistics.totalRuns}</div>
            <div className="stat-detail">
              {statistics.runHistory.length} completed runs
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Lifetime Profit</div>
            <div className={`stat-value ${statistics.totalWinnings >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(statistics.totalWinnings)}
            </div>
            <div className="stat-detail">
              Across all sessions
            </div>
          </div>
        </div>

        {lastRun && (
          <div className="last-run-section">
            <h3>Last Run Summary</h3>
            <div className="last-run-card">
              <div className="run-header">
                <div className="run-date">{formatDate(lastRun.startTime)}</div>
                <div className={`run-profit ${lastRun.netProfit >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(lastRun.netProfit)}
                </div>
              </div>
              <div className="run-stats">
                <div className="run-stat">
                  <span className="run-stat-label">Hands:</span>
                  <span className="run-stat-value">{lastRun.handsPlayed}</span>
                </div>
                <div className="run-stat">
                  <span className="run-stat-label">Wins:</span>
                  <span className="run-stat-value">{lastRun.handsWon}</span>
                </div>
                <div className="run-stat">
                  <span className="run-stat-label">Losses:</span>
                  <span className="run-stat-value">{lastRun.handsLost}</span>
                </div>
                <div className="run-stat">
                  <span className="run-stat-label">Pushes:</span>
                  <span className="run-stat-value">{lastRun.handsPushed}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <Button
            variant="primary"
            size="large"
            onClick={onStartRun}
            className="start-run-button"
          >
            Start New Run
          </Button>
          
          <Button
            variant="secondary"
            onClick={onViewStatistics}
            className="view-stats-button"
          >
            View All Statistics
          </Button>
        </div>

        <div className="quick-tips">
          <h4>Quick Tips</h4>
          <ul>
            <li>Follow the strategy hints to improve your win rate</li>
            <li>Practice with the drills mode to learn patterns</li>
            <li>Track your runs to see improvement over time</li>
            <li>Remember: basic strategy reduces the house edge to ~0.5%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
