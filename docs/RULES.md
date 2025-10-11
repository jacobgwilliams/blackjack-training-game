# Development Rules and Guidelines

## Project Overview
This is a blackjack training game designed to help players learn and practice blackjack strategy. The game will be web-first with a focus on educational value and user experience.

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
- Ensure fair and random card dealing
- Validate all game state transitions
- Maintain consistent game state across sessions
- Implement proper betting and payout calculations

### 4. Performance
- Optimize for fast loading and smooth gameplay
- Minimize bundle size
- Implement efficient state management
- Use lazy loading where appropriate
- Optimize images and assets

### 5. Educational Focus
- Provide clear explanations of blackjack rules
- Include strategy hints and tips
- Show probability calculations
- Track player statistics and improvement
- Offer different difficulty levels

## Technical Standards

### Frontend Framework
- Use React with TypeScript
- Implement responsive design with CSS Grid/Flexbox
- Use modern CSS features and animations
- Ensure cross-browser compatibility

### State Management
- Use React Context or Redux for complex state
- Keep game state immutable
- Implement proper state persistence
- Handle loading and error states gracefully

### Testing
- Write unit tests for game logic functions
- Implement integration tests for user flows
- Use Jest and React Testing Library
- Maintain high test coverage (>80%)

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