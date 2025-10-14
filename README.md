# AI Newsletter App

A modern, AI-powered newsletter application built with React, TypeScript, and Tailwind CSS. This application helps you research, compose, and send newsletters with the assistance of artificial intelligence.

## Features

### 🤖 AI-Powered Content Generation
- **Research Assistant**: AI researches topics and generates comprehensive content
- **Content Generation**: Automatically create newsletter content based on topics
- **Smart Suggestions**: Get AI-powered suggestions for headlines and content structure

### 📧 Newsletter Management
- **Rich Editor**: Create and edit newsletters with a modern interface
- **Template System**: Use pre-built templates or create custom ones
- **Draft Management**: Save and manage multiple newsletter drafts
- **Scheduling**: Schedule newsletters for future delivery

### 👥 Subscriber Management
- **Subscriber Database**: Manage your subscriber list with detailed profiles
- **Tagging System**: Organize subscribers with custom tags
- **Import/Export**: Easily import and export subscriber lists
- **Unsubscribe Management**: Handle unsubscribes automatically

### 📊 Analytics & Insights
- **Performance Metrics**: Track open rates, click rates, and engagement
- **Growth Analytics**: Monitor subscriber growth over time
- **Newsletter Performance**: Compare performance across different newsletters
- **Visual Charts**: Beautiful charts and graphs for data visualization

### ⚙️ Settings & Configuration
- **Email Provider Integration**: Connect with SMTP, SendGrid, Mailgun, or Amazon SES
- **AI Configuration**: Set up OpenAI API for AI features
- **Customization**: Customize newsletter appearance and branding

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Build Tool**: Vite
- **AI Integration**: OpenAI API (configurable)

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-newsletter-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_EMAIL_PROVIDER=smtp
VITE_SMTP_HOST=your_smtp_host
VITE_SMTP_PORT=587
VITE_SMTP_USERNAME=your_smtp_username
VITE_SMTP_PASSWORD=your_smtp_password
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating Your First Newsletter

1. Navigate to the Newsletter Editor
2. Enter a research topic in the AI Research Assistant panel
3. Click "Research & Generate" to let AI research and create content
4. Review and edit the generated content
5. Add a compelling title
6. Save as draft or send immediately

### Managing Subscribers

1. Go to the Subscribers page
2. Add subscribers manually or import from CSV
3. Use tags to organize your subscriber base
4. Track engagement and activity

### Viewing Analytics

1. Visit the Analytics page
2. View key metrics and performance charts
3. Track subscriber growth over time
4. Analyze newsletter performance

## Configuration

### AI Integration

To enable AI features, you'll need an OpenAI API key:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your environment variables
3. The AI features will be automatically enabled

### Email Provider Setup

The app supports multiple email providers:

- **SMTP**: Configure with your SMTP server details
- **SendGrid**: Use SendGrid API
- **Mailgun**: Use Mailgun API
- **Amazon SES**: Use AWS SES

Configure your preferred provider in the Settings page.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── data/               # Mock data and constants
└── App.tsx             # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

## Roadmap

- [ ] Advanced AI content customization
- [ ] A/B testing for newsletters
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app
- [ ] API for third-party integrations