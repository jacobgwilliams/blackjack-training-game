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
    // Hard totals strategy (matching strategy.ts logic)
    if (playerTotal <= 8) return 'H'; // Always hit
    if (playerTotal >= 17) return 'S'; // Always stand

    // 9: Double vs 3-6, otherwise hit
    if (playerTotal === 9) {
      return ['3', '4', '5', '6'].includes(dealerUpcard) ? 'D' : 'H';
    }
    
    // 10: Double vs 2-9, hit vs 10 or A
    if (playerTotal === 10) {
      return ['A', '10'].includes(dealerUpcard) ? 'H' : 'D';
    }
    
    // 11: Double vs 2-10, hit vs A
    if (playerTotal === 11) {
      return dealerUpcard === 'A' ? 'H' : 'D';
    }
    
    // 12: Stand vs 4-6, hit otherwise
    if (playerTotal === 12) {
      return ['4', '5', '6'].includes(dealerUpcard) ? 'S' : 'H';
    }
    
    // 13-16: Stand vs 2-6, hit vs 7-A
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
          <div className="strategy-grid-instructions">
            <h3>How to Use This Chart</h3>
            <p>
              Find your hand total in the <strong>left column</strong> (Player), then look across to find the column 
              matching the <strong>dealer's face-up card</strong>. The colored cell shows the optimal action:
            </p>
          </div>
          
          <div className="strategy-grid-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: getActionColor('H') }}></span>
              <span>Hit - Take another card</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: getActionColor('S') }}></span>
              <span>Stand - Keep your current hand</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: getActionColor('D') }}></span>
              <span>Double - Double your bet, take one card, then stand</span>
            </div>
          </div>
          
          <div className="strategy-grid-note">
            <strong>Note:</strong> This chart shows hard totals only. For soft hands (with an Ace counting as 11) 
            and pairs, check the Basic Strategy Guide for complete recommendations.
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
