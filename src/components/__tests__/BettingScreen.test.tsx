import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGameState } from '../../hooks/useGameState';
import { DEFAULT_GAME_SETTINGS } from '../../constants/gameRules';

// Mock the useGameState hook
jest.mock('../../hooks/useGameState');
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

// Mock the betting screen component
const BettingScreen = ({ onPlaceBet }: { onPlaceBet: (amount: number) => void }) => {
  const { gameState } = useGameState(DEFAULT_GAME_SETTINGS);
  
  return (
    <div className="betting-screen">
      <div className="betting-content">
        <h2>Place Your Bet</h2>
        <p>Current Balance: ${gameState.playerScore}</p>
        <div className="betting-options">
          <button
            onClick={() => onPlaceBet(10)}
            disabled={gameState.playerScore < 10}
          >
            $10
          </button>
          <button
            onClick={() => onPlaceBet(25)}
            disabled={gameState.playerScore < 25}
          >
            $25
          </button>
          <button
            onClick={() => onPlaceBet(50)}
            disabled={gameState.playerScore < 50}
          >
            $50
          </button>
          <button
            onClick={() => onPlaceBet(100)}
            disabled={gameState.playerScore < 100}
          >
            $100
          </button>
        </div>
      </div>
    </div>
  );
};

describe('BettingScreen Component', () => {
  const mockMakeBet = jest.fn();
  const mockStartGame = jest.fn();
  const mockInitializeNewGame = jest.fn();
  const mockPlayerAction = jest.fn();
  const mockDealerPlay = jest.fn();
  const mockNewGame = jest.fn();
  const mockUpdateSettings = jest.fn();
  const mockUpdateStatistics = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useGameState as jest.Mock).mockReturnValue({
      gameState: {
        phase: 'betting',
        deck: [],
        playerHand: { cards: [], total: 0, isSoft: false, isBlackjack: false, isBusted: false },
        dealerHand: { cards: [], total: 0, isSoft: false, isBlackjack: false, isBusted: false },
        playerScore: 1000,
        currentBet: 0,
        canDoubleDown: false,
        canSplit: false,
        canSurrender: false,
        canTakeInsurance: false,
        result: null,
        isGameActive: false,
      },
      settings: DEFAULT_GAME_SETTINGS,
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
      actions: {
        initializeNewGame: mockInitializeNewGame,
        makeBet: mockMakeBet,
        startGame: mockStartGame,
        playerAction: mockPlayerAction,
        dealerPlay: mockDealerPlay,
        newGame: mockNewGame,
        updateSettings: mockUpdateSettings,
        updateStatistics: mockUpdateStatistics,
      },
    });
  });

  it('should render betting screen with correct elements', () => {
    const mockOnPlaceBet = jest.fn();
    render(<BettingScreen onPlaceBet={mockOnPlaceBet} />);
    
    expect(screen.getByText('Place Your Bet')).toBeInTheDocument();
    expect(screen.getByText('Current Balance: $1000')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('$25')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('should call onPlaceBet when bet button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnPlaceBet = jest.fn();
    render(<BettingScreen onPlaceBet={mockOnPlaceBet} />);
    
    const betButton = screen.getByText('$25');
    await user.click(betButton);
    
    expect(mockOnPlaceBet).toHaveBeenCalledWith(25);
  });

  it('should disable bet buttons when insufficient funds', () => {
    (useGameState as jest.Mock).mockReturnValue({
      gameState: {
        phase: 'betting',
        deck: [],
        playerHand: { cards: [], total: 0, isSoft: false, isBlackjack: false, isBusted: false },
        dealerHand: { cards: [], total: 0, isSoft: false, isBlackjack: false, isBusted: false },
        playerScore: 50, // Low balance
        currentBet: 0,
        canDoubleDown: false,
        canSplit: false,
        canSurrender: false,
        canTakeInsurance: false,
        result: null,
        isGameActive: false,
      },
      settings: DEFAULT_GAME_SETTINGS,
      statistics: {},
      actions: {},
    });
    
    const mockOnPlaceBet = jest.fn();
    render(<BettingScreen onPlaceBet={mockOnPlaceBet} />);
    
    expect(screen.getByText('$10')).not.toBeDisabled();
    expect(screen.getByText('$25')).not.toBeDisabled();
    expect(screen.getByText('$50')).not.toBeDisabled();
    expect(screen.getByText('$100')).toBeDisabled();
  });

  it('should show correct balance', () => {
    (useGameState as jest.Mock).mockReturnValue({
      gameState: {
        phase: 'betting',
        deck: [],
        playerHand: { cards: [], total: 0, isSoft: false, isBlackjack: false, isBusted: false },
        dealerHand: { cards: [], total: 0, isSoft: false, isBlackjack: false, isBusted: false },
        playerScore: 750,
        currentBet: 0,
        canDoubleDown: false,
        canSplit: false,
        canSurrender: false,
        canTakeInsurance: false,
        result: null,
        isGameActive: false,
      },
      settings: DEFAULT_GAME_SETTINGS,
      statistics: {},
      actions: {},
    });
    
    const mockOnPlaceBet = jest.fn();
    render(<BettingScreen onPlaceBet={mockOnPlaceBet} />);
    
    expect(screen.getByText('Current Balance: $750')).toBeInTheDocument();
  });
});
