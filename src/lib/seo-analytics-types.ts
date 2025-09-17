export interface SEOConfig {
  id: string
  siteName: string
  siteDescription: string
  siteUrl: string
  defaultTitle: string
  defaultDescription: string
  defaultKeywords: string[]
  ogImage: string
  twitterHandle: string
  facebookAppId: string
  googleSiteVerification: string
  bingSiteVerification: string
  yandexSiteVerification: string
  structuredData: {
    organization: {
      name: string
      url: string
      logo: string
      contactPoint: {
        telephone: string
        contactType: string
      }
      sameAs: string[]
    }
    website: {
      name: string
      url: string
      description: string
    }
  }
  createdAt: string
  updatedAt: string
}

export interface AnalyticsConfig {
  id: string
  googleAnalyticsId: string
  googleTagManagerId: string
  facebookPixelId: string
  hotjarId: string
  mixpanelToken: string
  amplitudeApiKey: string
  customScripts: {
    head: string[]
    body: string[]
  }
  trackingEvents: {
    pageView: boolean
    scrollDepth: boolean
    formSubmissions: boolean
    buttonClicks: boolean
    fileDownloads: boolean
    outboundLinks: boolean
  }
  conversionGoals: {
    id: string
    name: string
    type: 'page_view' | 'form_submit' | 'button_click' | 'custom'
    selector?: string
    value?: number
    currency?: string
    isActive: boolean
  }[]
  createdAt: string
  updatedAt: string
}

export interface LeadCaptureForm {
  id: string
  name: string
  type: 'popup' | 'inline' | 'floating' | 'exit_intent'
  title: string
  description: string
  fields: {
    name: string
    type: 'text' | 'email' | 'phone' | 'select' | 'textarea'
    label: string
    placeholder?: string
    required: boolean
    options?: string[]
  }[]
  submitButtonText: string
  successMessage: string
  redirectUrl?: string
  triggerSettings: {
    delay?: number
    scrollPercentage?: number
    exitIntent?: boolean
    pages?: string[]
    excludePages?: string[]
  }
  styling: {
    backgroundColor: string
    textColor: string
    buttonColor: string
    buttonTextColor: string
    borderRadius: number
    width: number
    height?: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SitemapConfig {
  id: string
  includeBlog: boolean
  includePages: boolean
  includeProducts: boolean
  customUrls: {
    url: string
    lastModified: string
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
  }[]
  excludeUrls: string[]
  createdAt: string
  updatedAt: string
}

export interface RobotsConfig {
  id: string
  userAgent: string
  allow: string[]
  disallow: string[]
  crawlDelay?: number
  sitemap: string
  customRules: string
  createdAt: string
  updatedAt: string
}
