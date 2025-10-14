import { Button } from '../ui/Button';
import { RunStatistics } from '../../types/game';
import './RunComplete.css';

interface RunCompleteProps {
  completedRun: RunStatistics;
  onReturnToLanding: () => void;
  onStartNewRun?: () => void;
  onTryDrills?: () => void;
}

export function RunComplete({ completedRun, onReturnToLanding, onStartNewRun, onTryDrills }: RunCompleteProps) {
  const formatCurrency = (amount: number) => {
    return amount >= 0 ? `+$${amount}` : `-$${Math.abs(amount)}`;
  };

  const formatDuration = (startTime: number, endTime: number) => {
    const duration = endTime - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const winRate = completedRun.handsPlayed > 0 
    ? Math.round((completedRun.handsWon / completedRun.handsPlayed) * 100)
    : 0;

  return (
    <div className="run-complete">
      <div className="run-complete-content">
        <div className="completion-header">
          <h1>Thanks for Playing!</h1>
          <p className="completion-subtitle">Ready for your next challenge?</p>
        </div>

        <div className="run-summary">
          <div className="summary-card">
            <div className="summary-label">Run Duration</div>
            <div className="summary-value">
              {completedRun.endTime ? formatDuration(completedRun.startTime, completedRun.endTime) : 'N/A'}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Hands Played</div>
            <div className="summary-value">{completedRun.handsPlayed}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Win Rate</div>
            <div className="summary-value">{winRate}%</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Net Profit</div>
            <div className={`summary-value ${completedRun.netProfit >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(completedRun.netProfit)}
            </div>
          </div>
        </div>

        <div className="detailed-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Wins:</span>
              <span className="stat-value">{completedRun.handsWon}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Losses:</span>
              <span className="stat-value">{completedRun.handsLost}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Blackjacks:</span>
              <span className="stat-value">{completedRun.blackjacks}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Busts:</span>
              <span className="stat-value">{completedRun.busts}</span>
            </div>
          </div>
        </div>

        <div className="completion-actions">
          {onStartNewRun && (
            <Button
              variant="primary"
              onClick={onStartNewRun}
              className="action-button"
            >
              Start New Run
            </Button>
          )}
          {onTryDrills && (
            <Button
              variant="secondary"
              onClick={onTryDrills}
              className="action-button"
            >
              Try Drills Mode
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={onReturnToLanding}
            className="action-button"
          >
            Back to Home
          </Button>
        </div>

      </div>
    </div>
  );
}
