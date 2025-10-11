import { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import './HamburgerMenu.css';

interface HamburgerMenuProps {
  onResetGame?: () => void;
  onToggleStrategyGrid?: () => void;
  onToggleStrategyHints?: () => void;
  onShowStatistics?: () => void;
  onShowSettings?: () => void;
  showStrategyHints?: boolean;
  isDrillsMode?: boolean;
}

export function HamburgerMenu({
  onResetGame,
  onToggleStrategyGrid,
  onToggleStrategyHints,
  onShowStatistics,
  onShowSettings,
  showStrategyHints = true,
  isDrillsMode = false,
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button
        className={`hamburger-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {isOpen && (
        <div className="hamburger-dropdown">
          {onResetGame && (
            <Button
              variant="primary"
              size="small"
              onClick={() => handleAction(onResetGame)}
              className="hamburger-menu-item"
            >
              Reset Game
            </Button>
          )}

          {onToggleStrategyGrid && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleAction(onToggleStrategyGrid)}
              className="hamburger-menu-item"
            >
              Strategy Grid
            </Button>
          )}

          {onToggleStrategyHints && !isDrillsMode && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleAction(onToggleStrategyHints)}
              className="hamburger-menu-item"
            >
              {showStrategyHints ? 'Hide Hints' : 'Show Hints'}
            </Button>
          )}

          {onShowStatistics && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleAction(onShowStatistics)}
              className="hamburger-menu-item"
            >
              Stats
            </Button>
          )}

          {onShowSettings && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleAction(onShowSettings)}
              className="hamburger-menu-item"
            >
              Settings
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
