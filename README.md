# Blackjack Training Game

A web-based blackjack training game designed to help players learn optimal blackjack strategy through interactive gameplay and educational features.

## Features

### Core Game Features
- **Complete Blackjack Implementation**: Full blackjack rules with proper card dealing and hand evaluation
- **Strategy Training**: Real-time basic strategy recommendations and hints
- **Statistics Tracking**: Track your performance, win rate, and strategy adherence
- **Multiple Betting Options**: Flexible betting system with different amounts
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Educational Features
- **Basic Strategy Hints**: Get recommendations for optimal play
- **Probability Calculator**: See the odds for different actions
- **Interactive Tutorial**: Learn blackjack rules and strategy
- **Performance Analytics**: Track your improvement over time

### Technical Features
- **Modern React**: Built with React 18 and TypeScript
- **Fast Performance**: Optimized with Vite for quick loading
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Progressive Web App**: Can be installed on mobile devices

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blackjack-training-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Game Rules

### Basic Blackjack Rules
- **Objective**: Get as close to 21 as possible without going over
- **Card Values**: 
  - Number cards (2-10): Face value
  - Face cards (J, Q, K): 10 points
  - Ace: 1 or 11 points (whichever is better)
- **Winning**: Beat the dealer's hand without busting
- **Blackjack**: 21 with first two cards (3:2 payout)
- **Dealer Rules**: Must hit on 16, stand on 17

### Special Actions
- **Double Down**: Double your bet and take exactly one more card
- **Split**: Split pairs into two separate hands
- **Surrender**: Give up half your bet and end the hand
- **Insurance**: Side bet against dealer blackjack

## Strategy

The game implements basic strategy recommendations based on mathematical analysis:

- **Hard Totals**: Hit/stand decisions based on your total and dealer's upcard
- **Soft Totals**: Decisions for hands with Ace counted as 11
- **Pairs**: When to split pairs for optimal play
- **Insurance**: Mathematical decision based on remaining cards

## Architecture

### Project Structure
```
src/
├── components/
│   ├── game/          # Game-specific components
│   ├── ui/            # Reusable UI components
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── constants/         # Game constants and configuration
```

### Key Components
- **GameBoard**: Main game interface
- **Card**: Individual card component with animations
- **Hand**: Hand display with totals and status
- **Strategy Hints**: Real-time strategy recommendations

### State Management
- **useGameState**: Manages game state and actions
- **useBlackjackStrategy**: Provides strategy recommendations
- **useStatistics**: Tracks player performance

## Testing

The project includes comprehensive testing:

- **Unit Tests**: Game logic and utility functions
- **Component Tests**: React component behavior
- **Integration Tests**: User interactions and game flow

Run tests with:
```bash
npm run test
```

## Performance

- **Bundle Size**: < 500KB gzipped
- **Loading Time**: < 2 seconds on 3G
- **Runtime**: 60fps animations
- **Memory**: < 50MB for game session

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Basic strategy tables based on mathematical analysis
- Card designs inspired by traditional playing cards
- Accessibility guidelines from WCAG 2.1 AA
