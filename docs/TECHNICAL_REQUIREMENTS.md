# Technical Requirements Document

## Project: Blackjack Training Game

### 1. Project Overview
A web-based blackjack training game designed to help players learn optimal blackjack strategy through interactive gameplay and educational features.

**Live Site**: https://practiceblackjack.org  
**Status**: Production - Fully deployed with CI/CD on Vercel  
**Monetization**: Google AdSense enabled

### 2. Technology Stack

#### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **State Management**: React Context API (useReducer hook)
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Storage**: localStorage for state persistence

#### Development Tools
- **Package Manager**: npm or yarn
- **Version Control**: Git
- **Code Editor**: VS Code (recommended)
- **Browser DevTools**: Chrome DevTools

### 3. Core Features

#### Game Engine
- **Card System**: 52-card deck with proper shuffling
- **Game Logic**: Complete blackjack rules implementation
- **Hand Evaluation**: Automatic hand value calculation
- **Dealer AI**: Basic strategy implementation
- **Betting System**: Virtual currency with configurable limits

#### Training Features
- **Strategy Hints**: Real-time basic strategy recommendations (toggleable, Gameplay mode only)
- **Strategy Grid**: Interactive visual strategy reference chart
- **Basic Strategy Guide**: Comprehensive written strategy explanations
- **Statistics Tracking**: Persistent tracking of wins, losses, pushes, blackjacks, busts, and total winnings
- **Rule Explanations**: Detailed rules modal with special actions and casino hand signals
- **Debug Mode**: Force split hands for testing and practice
- **Drills Mode**: Rapid-fire multiple choice scenarios with 200+ unique situations
  - Hard totals, soft totals, and pairs practice
  - Immediate feedback with educational explanations
  - Score tracking and streak counter
  - Auto-filtered to remove obvious scenarios (e.g., 21)

#### User Interface
- **Responsive Design**: Mobile-first approach with full desktop support
  - Hamburger menu for mobile navigation (<768px)
  - Optimized card layouts for all screen sizes
  - Adaptive footer spacing
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation
- **Theme Support**: Automatic light/dark mode based on system preferences
- **Animations**: Smooth card dealing and transitions (300-500ms)
- **Modal System**: Reusable modals for Rules, Statistics, Settings, Strategy, Help, About
- **Dropdown Menus**: Mode selector and hamburger menu with proper UX
- **Confirmation Dialogs**: User-friendly confirmation for destructive actions
- **Visual Feedback**: Active hand indicators, win/lose badges, game phase display
- **Card Design**: Simplified centered rank+suit display for clarity
- **Win/Loss Display**: Explicit profit/loss and balance change per hand
- **Split Hand Display**: Side-by-side split hands with individual bet tracking

### 4. Technical Architecture

#### Component Structure
```
src/
├── components/
│   ├── game/
│   │   ├── GameBoard.tsx          # Main game display
│   │   ├── Card.tsx                # Individual card component
│   │   ├── Hand.tsx                # Hand display (cards + total)
│   │   └── StrategyGrid.tsx        # Interactive strategy chart
│   ├── ui/
│   │   ├── Button.tsx              # Reusable button component
│   │   ├── Modal.tsx               # Reusable modal component
│   │   └── ConfirmModal.tsx        # Confirmation dialog
│   └── layout/
│       ├── Header.tsx              # Navigation and controls
│       └── Footer.tsx              # Links and info
├── hooks/
│   ├── useGameState.ts             # Game state management (useReducer)
│   └── useBlackjackStrategy.ts     # Strategy recommendations
├── utils/
│   ├── cardUtils.ts                # Card operations and hand evaluation
│   ├── gameLogic.ts                # Core game logic with split support
│   ├── strategy.ts                 # Basic strategy implementation
│   └── storage.ts                  # localStorage utilities
├── types/
│   ├── game.ts                     # Game state types with SplitHandState
│   └── card.ts                     # Card and hand types
├── constants/
│   ├── gameRules.ts                # Game rules and settings
│   └── strategy.ts                 # Strategy tables
└── __tests__/
    ├── integration/                # Integration tests
    └── utils/                      # Unit tests
```

#### State Management
- **Game State**: Current hand, deck, dealer hand, player score, split hands tracking
- **Persistence**: localStorage for balance and statistics across sessions
- **UI State**: Modal visibility, strategy hints toggle, debug mode
- **Statistics**: Persistent tracking of games played, wins, losses, pushes, blackjacks, busts
- **Settings**: User preferences including debug mode for testing split functionality

### 5. Game Rules Implementation

#### Basic Blackjack Rules
- **Objective**: Get as close to 21 without going over
- **Card Values**: Face cards = 10, Ace = 1 or 11, Number cards = face value
- **Winning**: Beat dealer's hand without busting
- **Blackjack**: 21 with first two cards (3:2 payout)
- **Dealer Rules**: Must hit on 16, stand on 17

#### Advanced Features (All Implemented)
- **Splitting**: Full split implementation with side-by-side hand display
  - Independent bet tracking per hand
  - Automatic hand progression
  - Support for all action combinations (hit, stand, double on split hands)
  - Visual indicators for active/completed hands
- **Doubling Down**: Double bet with automatic hand completion
  - Full support on split hands
  - Proper balance deduction and payout
- **Insurance**: Side bet against dealer blackjack (UI available)
- **Surrender**: Give up half bet (UI available)
- **Balance Persistence**: Player balance saved across sessions
- **Statistics Persistence**: Game statistics saved across sessions
- **Reset Functionality**: Separate reset for balance and statistics with confirmation

### 6. Strategy Implementation

#### Basic Strategy
- **Hard Totals**: Hit/stand decisions based on total and dealer upcard
- **Soft Totals**: Decisions for hands with Ace counted as 11
- **Pairs**: When to split pairs
- **Insurance**: Mathematical decision based on remaining cards

#### Strategy Tables
- **Hard Totals Table**: 8x10 matrix for hit/stand decisions
- **Soft Totals Table**: 8x10 matrix for soft hands
- **Pairs Table**: 10x10 matrix for splitting decisions
- **Insurance Table**: Probability-based recommendations

### 7. Performance Requirements

#### Loading Performance
- **Initial Load**: < 2 seconds on 3G connection
- **Bundle Size**: < 500KB gzipped
- **Code Splitting**: Lazy load non-critical components
- **Image Optimization**: WebP format with fallbacks

#### Runtime Performance
- **Frame Rate**: 60fps for animations
- **Memory Usage**: < 50MB for game session
- **State Updates**: < 16ms for game state changes
- **Card Animations**: Smooth 300ms transitions

### 8. Browser Compatibility

#### Supported Browsers
- **Chrome**: 90+ (ES2020 support)
- **Firefox**: 88+ (ES2020 support)
- **Safari**: 14+ (ES2020 support)
- **Edge**: 90+ (Chromium-based)

#### Mobile Support
- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Samsung Internet**: 14+

### 9. Accessibility Requirements

#### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles
- **Color Contrast**: 4.5:1 minimum ratio
- **Focus Management**: Visible focus indicators
- **Text Alternatives**: Alt text for all images

#### Implementation Details
- **Semantic HTML**: Use proper heading hierarchy
- **ARIA Labels**: Descriptive labels for interactive elements
- **Focus Traps**: Modal dialogs trap focus
- **Skip Links**: Navigation shortcuts for keyboard users

### 10. Testing Strategy

#### Unit Testing
- **Game Logic**: Test all card operations and hand evaluations
- **Strategy**: Test basic strategy calculations
- **Utilities**: Test helper functions and calculations
- **Components**: Test component rendering and behavior

#### Integration Testing
- **Game Flow**: Test complete game sessions
- **User Interactions**: Test button clicks and form submissions
- **State Management**: Test state updates and persistence
- **API Integration**: Test external service calls

#### End-to-End Testing
- **User Journeys**: Test complete user workflows
- **Cross-Browser**: Test on different browsers
- **Mobile Testing**: Test on various mobile devices
- **Performance**: Test loading and runtime performance

### 11. Deployment Requirements

#### Build Process
- **Production Build**: Optimized and minified
- **Asset Optimization**: Compressed images and fonts
- **Environment Variables**: Secure configuration management
- **Source Maps**: For debugging in production

#### Hosting
- **Static Hosting**: Netlify, Vercel, or similar
- **CDN**: Global content delivery
- **HTTPS**: SSL certificate required
- **Custom Domain**: Optional custom domain support

### 12. Security Considerations

#### Data Protection
- **No Personal Data**: No collection of personal information
- **Local Storage**: Secure local data storage
- **Input Validation**: Sanitize all user inputs
- **XSS Prevention**: Proper content sanitization

#### Code Security
- **Dependency Scanning**: Regular security audits
- **Secure Headers**: Implement security headers
- **Content Security Policy**: Restrict resource loading
- **Regular Updates**: Keep dependencies updated

### 13. Monitoring and Analytics

#### Performance Monitoring
- **Core Web Vitals**: Track LCP, FID, CLS
- **Error Tracking**: Monitor JavaScript errors
- **User Analytics**: Track user interactions (anonymized)
- **Performance Metrics**: Monitor loading times

#### Game Analytics
- **Session Duration**: Track average play time
- **Feature Usage**: Monitor which features are used
- **Error Rates**: Track game logic errors
- **User Engagement**: Monitor return visits

### 14. Implemented Features Summary

#### Core Gameplay ✅
- Complete blackjack rules with proper hand evaluation
- 6-deck shoe with proper shuffling
- Betting system with configurable limits ($10-$500)
- Starting balance of $1000 with persistence
- Automatic dealer play after player completes hands

#### Split Functionality ✅
- Full split implementation for pairs
- Side-by-side hand display with visual indicators
- Independent bet tracking ($10 per hand)
- Support for hit, stand, and double down on split hands
- Automatic hand progression and result calculation
- Debug mode to force split hands for testing

#### Training Features ✅
- Real-time strategy hints (toggleable)
- Interactive strategy grid with color-coded recommendations
- Comprehensive basic strategy guide
- Detailed rules with casino hand signals
- Persistent statistics tracking

#### UI/UX ✅
- Responsive design (desktop and mobile)
- Dark mode support (automatic based on system)
- Modal system for all information displays
- Confirmation dialogs for destructive actions
- Visual feedback for game state
- Smooth animations (300-500ms transitions)

#### Data Persistence ✅
- Balance saved in localStorage
- Statistics saved in localStorage
- Separate reset functionality for balance and stats
- Data persists across browser sessions

### 15. Future Enhancements

#### Phase 2 Features
- **Card Counting Training**: Advanced strategy modes
- **Multiple Players**: Multi-hand gameplay
- **Achievement System**: Track milestones and accomplishments
- **Customization**: Custom themes and card designs
- **Sound Effects**: Optional audio feedback
- **Probability Calculator**: Real-time odds display

#### Technical Improvements
- **PWA Support**: Progressive Web App features for offline play
- **Performance**: Further bundle size optimization
- **Advanced Analytics**: More detailed gameplay statistics
- **Accessibility**: Enhanced screen reader support