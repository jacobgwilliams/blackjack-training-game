# Development Rules and Guidelines

## Project Overview
This is a blackjack training game designed to help players learn and practice blackjack strategy. The game is web-based with a focus on educational value, user experience, and accurate gameplay simulation including full split functionality.

## Core Development Principles

### 1. Code Quality
- Write clean, readable, and well-documented code
- Follow consistent naming conventions
- Use TypeScript for type safety
- Implement proper error handling
- Write unit tests for critical game logic

### 2. User Experience
- Prioritize intuitive and responsive design
- Ensure accessibility compliance (WCAG 2.1 AA)
- Provide clear feedback for all user actions
- Implement smooth animations and transitions
- Support both desktop and mobile devices

### 3. Game Logic Integrity
- Implement accurate blackjack rules and strategy
- Ensure fair and random card dealing with 6-deck shoe
- Validate all game state transitions
- Maintain consistent game state across sessions with localStorage
- Implement proper betting and payout calculations
- Support full split functionality with independent hand tracking
- Handle all action combinations: hit, stand, double down on split hands
- Automatic hand progression and proper phase management

### 4. Performance
- Optimize for fast loading and smooth gameplay
- Minimize bundle size
- Implement efficient state management
- Use lazy loading where appropriate
- Optimize images and assets

### 5. Educational Focus
- Provide clear explanations of blackjack rules with casino hand signals
- Include real-time strategy hints (toggleable)
- Interactive strategy grid with color-coded recommendations
- Comprehensive basic strategy guide
- Track player statistics with persistent localStorage
- Detailed explanations of special actions (split, double, surrender, insurance)
- Debug mode for testing and learning split strategies

## Technical Standards

### Frontend Framework
- Use React 18+ with TypeScript strict mode
- Vite as build tool for fast development
- CSS Modules for component styling
- Implement responsive design with CSS Grid/Flexbox
- Use modern CSS features and animations (300-500ms transitions)
- Ensure cross-browser compatibility and dark mode support

### State Management
- Use React Context API with useReducer for game state
- Keep game state immutable with proper type safety
- Implement localStorage persistence for balance and statistics
- Handle loading and error states gracefully
- Separate concerns: UI state, game state, persistence
- Support complex split hand state with independent tracking

### Testing
- Write unit tests for game logic functions (90+ tests passing)
- Implement integration tests for complete user flows
- Use Jest and React Testing Library
- Maintain high test coverage (>80%)
- Test all split hand scenarios and combinations
- Test localStorage persistence
- Test confirmation modals and user interactions

### Code Organization
- Use feature-based folder structure
- Separate concerns (UI, logic, data)
- Implement proper component composition
- Use custom hooks for reusable logic

## Git Workflow
- Use feature branches for new development
- Write descriptive commit messages
- Create pull requests for code review
- Keep main branch stable and deployable
- Use conventional commit format

## Documentation
- Document all public APIs and functions
- Maintain up-to-date README
- Include setup and deployment instructions
- Document game rules and features
- Keep technical requirements current

## Security Considerations
- Validate all user inputs
- Sanitize data before rendering
- Implement proper session management
- Use HTTPS in production
- Follow OWASP security guidelines

## Accessibility Requirements
- Support keyboard navigation
- Provide alt text for images
- Use semantic HTML elements
- Ensure sufficient color contrast
- Support screen readers
- Implement focus management

## Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms
- Bundle size: < 500KB gzipped

## Implemented Features (Current Status)

### Core Game Mechanics ✅
- Complete blackjack rules with accurate hand evaluation
- 6-deck shoe with proper shuffling algorithm
- Betting system ($10-$500 range)
- Starting balance: $1000
- Proper payouts: 1:1 for wins, 3:2 for blackjack, return bet on push

### Split Functionality ✅
- **Full Implementation**: Side-by-side split hand display
- **Independent Tracking**: Each hand has its own bet and result
- **Visual Indicators**: Active hand highlighted with blue glow
- **Action Support**: Hit, stand, and double down on all split hands
- **Automatic Progression**: Seamlessly moves between hands
- **Result Display**: Individual win/lose/push badges per hand
- **Debug Mode**: Force split hands for testing via Settings

### Training Tools ✅
- **Strategy Hints**: Real-time recommendations (toggleable in Settings)
- **Strategy Grid**: Interactive visual chart accessible from header
- **Basic Strategy Guide**: Comprehensive written guide in footer
- **Rules Modal**: Detailed rules with casino hand signals
- **Statistics**: Persistent tracking across sessions

### UI/UX Features ✅
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Automatic based on system preferences
- **Modal System**: Rules, Statistics, Settings, Strategy, Help
- **Confirmation Dialogs**: For reset balance and reset statistics
- **Visual Feedback**: Phase display, active hand indicators, result badges
- **Smooth Animations**: 300-500ms transitions for professional feel

### Data Persistence ✅
- **Balance**: Saved in localStorage, persists across sessions
- **Statistics**: Saved in localStorage, tracks all-time performance
- **Reset Options**: 
  - "Reset Game" resets balance to $1000 (with confirmation)
  - "Reset Statistics" clears stats but preserves balance (with confirmation)

### Testing ✅
- 90+ unit and integration tests passing
- Comprehensive split functionality test coverage
- All scenario combinations tested
- No linter errors
- TypeScript strict mode compliance