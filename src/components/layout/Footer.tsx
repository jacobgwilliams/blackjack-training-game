import './Footer.css';

interface FooterProps {
  className?: string;
  onShowRules?: () => void;
  onShowStrategy?: () => void;
  onShowHelp?: () => void;
  onShowAbout?: () => void;
}

export function Footer({ className = '', onShowRules, onShowStrategy, onShowHelp, onShowAbout }: FooterProps) {
  return (
    <footer className={`footer ${className}`}>
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-text">
            © 2025 Jacob Williams
          </p>
          <p className="footer-text footer-responsible-gaming">
            <a 
              href="https://www.ncpgambling.org/help-treatment/help-by-state/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-help-link"
            >
              🎗️ Problem Gambling Resources
            </a>
            {' '}&bull;{' '}
            <a 
              href="tel:1-800-522-4700"
              className="footer-help-link"
            >
              1-800-522-4700
            </a>
          </p>
        </div>
        
        <div className="footer-right">
          <div className="footer-links">
            <button 
              onClick={onShowRules}
              className="footer-link"
              aria-label="Game Rules"
            >
              Rules
            </button>
            <button 
              onClick={onShowStrategy}
              className="footer-link"
              aria-label="Basic Strategy"
            >
              Strategy
            </button>
            <button 
              onClick={onShowHelp}
              className="footer-link"
              aria-label="Help & Support"
            >
              Help
            </button>
            <button 
              onClick={onShowAbout}
              className="footer-link"
              aria-label="About"
            >
              About
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
