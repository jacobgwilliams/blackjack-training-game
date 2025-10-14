import { Analytics, Newsletter, Subscriber } from '../types'

export const mockNewsletters: Newsletter[] = [
  {
    id: '1',
    title: 'Weekly AI Insights - Issue #1',
    content: 'Welcome to our first AI newsletter...',
    status: 'sent',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    sentAt: new Date('2024-01-15'),
    openRate: 24.5,
    clickRate: 8.2,
    subscriberCount: 1250
  },
  {
    id: '2',
    title: 'Machine Learning Trends - Issue #2',
    content: 'This week we explore the latest ML trends...',
    status: 'sent',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    sentAt: new Date('2024-01-22'),
    openRate: 28.1,
    clickRate: 12.3,
    subscriberCount: 1280
  },
  {
    id: '3',
    title: 'AI Ethics and Governance - Issue #3',
    content: 'Draft content about AI ethics...',
    status: 'draft',
    createdAt: new Date('2024-01-29'),
    updatedAt: new Date('2024-01-29'),
    subscriberCount: 1300
  }
]

export const mockSubscribers: Subscriber[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    subscribedAt: new Date('2024-01-01'),
    status: 'active',
    tags: ['early-adopter', 'tech'],
    lastOpened: new Date('2024-01-22'),
    lastClicked: new Date('2024-01-22')
  },
  {
    id: '2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    subscribedAt: new Date('2024-01-05'),
    status: 'active',
    tags: ['business', 'ai'],
    lastOpened: new Date('2024-01-22'),
    lastClicked: new Date('2024-01-15')
  }
]

export const mockAnalytics: Analytics = {
  totalSubscribers: 1300,
  activeSubscribers: 1250,
  totalNewsletters: 2,
  averageOpenRate: 26.3,
  averageClickRate: 10.25,
  recentNewsletters: mockNewsletters,
  subscriberGrowth: [
    { date: '2024-01-01', count: 1000 },
    { date: '2024-01-08', count: 1100 },
    { date: '2024-01-15', count: 1200 },
    { date: '2024-01-22', count: 1250 },
    { date: '2024-01-29', count: 1300 }
  ],
  openRates: [
    { date: '2024-01-15', rate: 24.5 },
    { date: '2024-01-22', rate: 28.1 }
  ]
}