import React from 'react';
import './Footer.css';

interface FooterProps {
  className?: string;
  onShowRules?: () => void;
  onShowStrategy?: () => void;
  onShowHelp?: () => void;
}

export function Footer({ className = '', onShowRules, onShowStrategy, onShowHelp }: FooterProps) {
  return (
    <footer className={`footer ${className}`}>
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-text">
            © 2025 Jacob Williams. Built for educational purposes.
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
          </div>
        </div>
      </div>
    </footer>
  );
}
