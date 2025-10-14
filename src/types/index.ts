export interface Newsletter {
  id: string
  title: string
  content: string
  status: 'draft' | 'scheduled' | 'sent'
  createdAt: Date
  updatedAt: Date
  scheduledFor?: Date
  sentAt?: Date
  openRate?: number
  clickRate?: number
  subscriberCount?: number
}

export interface Subscriber {
  id: string
  email: string
  firstName?: string
  lastName?: string
  subscribedAt: Date
  status: 'active' | 'unsubscribed' | 'bounced'
  tags?: string[]
  lastOpened?: Date
  lastClicked?: Date
}

export interface AIResearch {
  id: string
  topic: string
  sources: string[]
  summary: string
  keyPoints: string[]
  createdAt: Date
  status: 'researching' | 'completed' | 'failed'
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  createdAt: Date
  updatedAt: Date
}

export interface Analytics {
  totalSubscribers: number
  activeSubscribers: number
  totalNewsletters: number
  averageOpenRate: number
  averageClickRate: number
  recentNewsletters: Newsletter[]
  subscriberGrowth: {
    date: string
    count: number
  }[]
  openRates: {
    date: string
    rate: number
  }[]
}