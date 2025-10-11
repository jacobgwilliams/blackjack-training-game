import React from 'react';
import { Button } from '../ui/Button';
import './Header.css';

interface HeaderProps {
  onShowRules?: () => void;
  onShowStatistics?: () => void;
  onShowSettings?: () => void;
  onNewGame?: () => void;
  currentBalance?: number;
}

export function Header({
  onShowRules,
  onShowStatistics,
  onShowSettings,
  onNewGame,
  currentBalance = 0,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">
            <span className="header-title-icon">🃏</span>
            Blackjack Training
          </h1>
        </div>
        
        <div className="header-center">
          {currentBalance > 0 && (
            <div className="header-balance">
              Balance: <span className="header-balance-amount">${currentBalance}</span>
            </div>
          )}
        </div>
        
        <div className="header-right">
          <nav className="header-nav">
            {onNewGame && (
              <Button
                variant="primary"
                size="small"
                onClick={onNewGame}
                className="header-nav-button"
              >
                New Game
              </Button>
            )}
            
            {onShowRules && (
              <Button
                variant="secondary"
                size="small"
                onClick={onShowRules}
                className="header-nav-button"
              >
                Rules
              </Button>
            )}
            
            {onShowStatistics && (
              <Button
                variant="secondary"
                size="small"
                onClick={onShowStatistics}
                className="header-nav-button"
              >
                Stats
              </Button>
            )}
            
            {onShowSettings && (
              <Button
                variant="secondary"
                size="small"
                onClick={onShowSettings}
                className="header-nav-button"
              >
                Settings
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
