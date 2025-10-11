import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { HamburgerMenu } from '../ui/HamburgerMenu';
import './Header.css';

interface HeaderProps {
  onShowRules?: () => void;
  onShowStatistics?: () => void;
  onShowSettings?: () => void;
  onResetGame?: () => void;
  onToggleStrategyGrid?: () => void;
  onToggleStrategyHints?: () => void;
  onToggleDrillsMode?: () => void;
  showStrategyHints?: boolean;
  isDrillsMode?: boolean;
  currentBalance?: number;
}

export function Header({
  onShowRules,
  onShowStatistics,
  onShowSettings,
  onResetGame,
  onToggleStrategyGrid,
  onToggleStrategyHints,
  onToggleDrillsMode,
  showStrategyHints = true,
  isDrillsMode = false,
  currentBalance = 0,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">
            <span className="header-title-icon">🃏</span>
            PracticeBlackjack.org
          </h1>
        </div>
        
        <div className="header-center">
          {currentBalance > 0 && !isDrillsMode && (
            <div className="header-balance">
              Balance: <span className="header-balance-amount">${currentBalance}</span>
            </div>
          )}
        </div>
        
        <div className="header-right">
          <nav className="header-nav">
            <HamburgerMenu
              onResetGame={onResetGame}
              onToggleStrategyGrid={onToggleStrategyGrid}
              onToggleStrategyHints={onToggleStrategyHints}
              onShowStatistics={onShowStatistics}
              onShowSettings={onShowSettings}
              showStrategyHints={showStrategyHints}
              isDrillsMode={isDrillsMode}
            />
            
            {onToggleDrillsMode && (
              <Dropdown
                options={[
                  { value: 'gameplay', label: 'Gameplay' },
                  { value: 'drills', label: 'Run Drills' }
                ]}
                value=""
                onChange={(value) => {
                  if (value === 'drills' && !isDrillsMode) {
                    onToggleDrillsMode();
                  } else if (value === 'gameplay' && isDrillsMode) {
                    onToggleDrillsMode();
                  }
                }}
                placeholder="Modes"
                className="header-mode-dropdown"
              />
            )}
            
            {onResetGame && (
              <Button
                variant="primary"
                size="small"
                onClick={onResetGame}
                className="header-nav-button"
              >
                Reset Game
              </Button>
            )}
            
            {onToggleStrategyGrid && (
              <Button
                variant="secondary"
                size="small"
                onClick={onToggleStrategyGrid}
                className="header-nav-button"
              >
                Strategy Grid
              </Button>
            )}
            
            {onToggleStrategyHints && !isDrillsMode && (
              <Button
                variant="secondary"
                size="small"
                onClick={onToggleStrategyHints}
                className="header-nav-button"
              >
                {showStrategyHints ? 'Hide Hints' : 'Show Hints'}
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
