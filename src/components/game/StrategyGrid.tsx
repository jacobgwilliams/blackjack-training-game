import React from 'react';
import './StrategyGrid.css';

interface StrategyGridProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StrategyGrid({ isOpen, onClose }: StrategyGridProps) {
  if (!isOpen) return null;

  const dealerUpcards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const playerTotals = Array.from({ length: 16 }, (_, i) => i + 5); // 5-20

  const getRecommendedAction = (playerTotal: number, dealerUpcard: string): string => {
    // Hard totals
    if (playerTotal <= 8) return 'H'; // Always hit
    if (playerTotal >= 17) return 'S'; // Always stand

    // Specific recommendations
    if (playerTotal === 9) {
      return ['3', '4', '5', '6'].includes(dealerUpcard) ? 'D' : 'H';
    }
    if (playerTotal === 10) {
      return dealerUpcard === 'A' || dealerUpcard === '10' ? 'H' : 'D';
    }
    if (playerTotal === 11) {
      return dealerUpcard === 'A' ? 'H' : 'D';
    }
    if (playerTotal === 12) {
      return ['4', '5', '6'].includes(dealerUpcard) ? 'S' : 'H';
    }
    if (playerTotal >= 13 && playerTotal <= 16) {
      return ['2', '3', '4', '5', '6'].includes(dealerUpcard) ? 'S' : 'H';
    }

    return 'H'; // Default to hit
  };

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'H': return 'red';    // Hit
      case 'S': return 'green';  // Stand
      case 'D': return 'blue';   // Double
      case 'P': return 'purple'; // Split
      default: return 'gray';
    }
  };

  const getActionText = (action: string): string => {
    switch (action) {
      case 'H': return 'Hit';
      case 'S': return 'Stand';
      case 'D': return 'Double';
      case 'P': return 'Split';
      default: return action;
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="strategy-grid-overlay" onClick={handleOverlayClick}>
      <div className="strategy-grid">
        <div className="strategy-grid-header">
          <h2>Basic Strategy Grid</h2>
          <button className="strategy-grid-close" onClick={onClose}>×</button>
        </div>
        
        <div className="strategy-grid-content">
          <div className="strategy-grid-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: getActionColor('H') }}></span>
              <span>Hit</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: getActionColor('S') }}></span>
              <span>Stand</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: getActionColor('D') }}></span>
              <span>Double</span>
            </div>
          </div>

          <table className="strategy-table">
            <thead>
              <tr>
                <th>Player</th>
                {dealerUpcards.map(card => (
                  <th key={card}>{card}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playerTotals.map(total => (
                <tr key={total}>
                  <td>{total}</td>
                  {dealerUpcards.map(card => {
                    const action = getRecommendedAction(total, card);
                    return (
                      <td 
                        key={card}
                        className={`action-cell action-${action.toLowerCase()}`}
                        title={`Player: ${total}, Dealer: ${card} → ${getActionText(action)}`}
                      >
                        {action}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
