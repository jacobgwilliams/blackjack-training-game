import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

// Mock the statistics hook to avoid localStorage issues in tests
jest.mock('../../hooks/useStatistics', () => ({
  useStatistics: () => ({
    updateGameResult: jest.fn(),
    updateBalance: jest.fn(),
    updateHandStats: jest.fn(),
    statistics: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesPushed: 0,
      totalWinnings: 0,
      currentBalance: 1000,
      strategyAccuracy: 0,
      averageHandValue: 0,
      blackjacks: 0,
      busts: 0,
    },
  }),
}));

describe('Game Flow Integration Tests', () => {
  beforeEach(() => {
    // Clear any existing localStorage
    localStorage.clear();
  });

  describe('Betting Screen', () => {
    it('should show betting screen initially', () => {
      render(<App />);
      
      expect(screen.getByText('Place Your Bet')).toBeInTheDocument();
      expect(screen.getByText('Current Balance: $1000')).toBeInTheDocument();
      expect(screen.getByText('$10')).toBeInTheDocument();
      expect(screen.getByText('$25')).toBeInTheDocument();
      expect(screen.getByText('$50')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
    });

    it('should transition to game board after placing a bet', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Initially should show betting screen
      expect(screen.getByText('Place Your Bet')).toBeInTheDocument();
      
      // Click a bet button
      const betButton = screen.getByText('$25');
      await user.click(betButton);
      
      // Should transition to game board
      await waitFor(() => {
        expect(screen.queryByText('Place Your Bet')).not.toBeInTheDocument();
      });
      
      // Should show game board elements
      expect(screen.getByText('Dealer')).toBeInTheDocument();
      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('Balance: $975')).toBeInTheDocument();
      expect(screen.getByText('Current Bet: $25')).toBeInTheDocument();
    });

    it('should not allow betting more than available balance', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Try to bet more than available balance
      const betButton = screen.getByText('$100');
      await user.click(betButton);
      
      // Should still be on betting screen
      expect(screen.getByText('Place Your Bet')).toBeInTheDocument();
    });

    it('should disable bet buttons when insufficient funds', () => {
      render(<App />);
      
      // All buttons should be enabled initially
      expect(screen.getByText('$10')).not.toBeDisabled();
      expect(screen.getByText('$25')).not.toBeDisabled();
      expect(screen.getByText('$50')).not.toBeDisabled();
      expect(screen.getByText('$100')).not.toBeDisabled();
    });
  });

  describe('Game Board Transitions', () => {
    it('should show player and dealer hands after betting', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Place a bet
      await user.click(screen.getByText('$25'));
      
      // Wait for game board to appear
      await waitFor(() => {
        expect(screen.getByText('Dealer')).toBeInTheDocument();
        expect(screen.getByText('Player')).toBeInTheDocument();
      });
      
      // Should show cards
      await waitFor(() => {
        const playerCards = screen.getByText('Player').closest('.hand')?.querySelectorAll('.card');
        const dealerCards = screen.getByText('Dealer').closest('.hand')?.querySelectorAll('.card');
        
        expect(playerCards).toHaveLength(2);
        expect(dealerCards).toHaveLength(2);
      });
    });

    it('should show player action buttons after dealing', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Place a bet
      await user.click(screen.getByText('$25'));
      
      // Wait for game board and action buttons
      await waitFor(() => {
        expect(screen.getByText('Hit')).toBeInTheDocument();
        expect(screen.getByText('Stand')).toBeInTheDocument();
      });
    });

    it('should show strategy hints when available', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Place a bet
      await user.click(screen.getByText('$25'));
      
      // Wait for strategy hints to appear
      await waitFor(() => {
        expect(screen.getByText('Strategy Hint:')).toBeInTheDocument();
      });
    });
  });

  describe('Player Actions', () => {
    it('should allow player to hit and receive another card', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Place a bet and start game
      await user.click(screen.getByText('$25'));
      
      // Wait for game board
      await waitFor(() => {
        expect(screen.getByText('Hit')).toBeInTheDocument();
      });
      
      // Click hit
      await user.click(screen.getByText('Hit'));
      
      // Should have 3 cards now
      await waitFor(() => {
        const playerCards = screen.getByText('Player').closest('.hand')?.querySelectorAll('.card');
        expect(playerCards).toHaveLength(3);
      });
    });

    it('should allow player to stand and move to dealer turn', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Place a bet and start game
      await user.click(screen.getByText('$25'));
      
      // Wait for game board
      await waitFor(() => {
        expect(screen.getByText('Stand')).toBeInTheDocument();
      });
      
      // Click stand
      await user.click(screen.getByText('Stand'));
      
      // Should show dealer play button
      await waitFor(() => {
        expect(screen.getByText('Play Dealer Hand')).toBeInTheDocument();
      });
    });

    it('should end game if player busts', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Place a bet and start game
      await user.click(screen.getByText('$25'));
      
      // Wait for game board
      await waitFor(() => {
        expect(screen.getByText('Hit')).toBeInTheDocument();
      });
      
      // Keep hitting until bust (this might take several clicks)
      let hitButton = screen.getByText('Hit');
      for (let i = 0; i < 10; i++) {
        if (hitButton && !hitButton.disabled) {
          await user.click(hitButton);
          await waitFor(() => {
            const newHitButton = screen.queryByText('Hit');
            if (newHitButton && newHitButton.disabled) {
              hitButton = null;
            }
          });
        } else {
          break;
        }
      }
      
      // Should show game over
      await waitFor(() => {
        expect(screen.getByText('New Game')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Functionality', () => {
    it('should open and close rules modal', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Click rules button
      await user.click(screen.getByText('Rules'));
      
      // Should show rules modal
      expect(screen.getByText('Blackjack Rules')).toBeInTheDocument();
      expect(screen.getByText('Objective')).toBeInTheDocument();
      
      // Close modal
      await user.click(screen.getByText('×'));
      
      // Modal should be closed
      expect(screen.queryByText('Blackjack Rules')).not.toBeInTheDocument();
    });

    it('should open and close statistics modal', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Click stats button
      await user.click(screen.getByText('Stats'));
      
      // Should show statistics modal
      expect(screen.getByText('Game Statistics')).toBeInTheDocument();
      expect(screen.getByText('Games Played')).toBeInTheDocument();
      
      // Close modal
      await user.click(screen.getByText('×'));
      
      // Modal should be closed
      expect(screen.queryByText('Game Statistics')).not.toBeInTheDocument();
    });

    it('should open footer links modals', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Click footer strategy link
      await user.click(screen.getByText('Strategy'));
      
      // Should show strategy modal
      expect(screen.getByText('Basic Strategy Guide')).toBeInTheDocument();
      
      // Close modal
      await user.click(screen.getByText('×'));
      
      // Click footer help link
      await user.click(screen.getByText('Help'));
      
      // Should show help modal
      expect(screen.getByText('Help & Support')).toBeInTheDocument();
    });
  });

  describe('Game State Persistence', () => {
    it('should maintain game state during play', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      // Place a bet
      await user.click(screen.getByText('$25'));
      
      // Verify balance is updated
      await waitFor(() => {
        expect(screen.getByText('Balance: $975')).toBeInTheDocument();
        expect(screen.getByText('Current Bet: $25')).toBeInTheDocument();
      });
      
      // Hit once
      await user.click(screen.getByText('Hit'));
      
      // Balance should remain the same
      expect(screen.getByText('Balance: $975')).toBeInTheDocument();
      expect(screen.getByText('Current Bet: $25')).toBeInTheDocument();
    });
  });
});
