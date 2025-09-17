'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AnalyticsConfig } from '@/lib/seo-analytics-types'

interface AnalyticsTrackerProps {
  children: React.ReactNode
}

export function AnalyticsTracker({ children }: AnalyticsTrackerProps) {
  const [analyticsConfig, setAnalyticsConfig] = useState<AnalyticsConfig | null>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initializeAnalytics = useCallback((config: AnalyticsConfig) => {
    if (config.googleAnalyticsId) {
      loadGoogleAnalytics(config.googleAnalyticsId)
    }
    if (config.googleTagManagerId) {
      loadGoogleTagManager(config.googleTagManagerId)
    }
    if (config.facebookPixelId) {
      loadFacebookPixel(config.facebookPixelId)
    }
    if (config.hotjarId) {
      loadHotjar(config.hotjarId)
    }
    if (config.mixpanelToken) {
      loadMixpanel(config.mixpanelToken)
    }
    if (config.amplitudeApiKey) {
      loadAmplitude(config.amplitudeApiKey)
    }
    config.customScripts.head.forEach(script => {
      const scriptElement = document.createElement('script')
      scriptElement.innerHTML = script
      document.head.appendChild(scriptElement)
    })
    config.customScripts.body.forEach(script => {
      const scriptElement = document.createElement('script')
      scriptElement.innerHTML = script
      document.body.appendChild(scriptElement)
    })
  }, [])

  const fetchAnalyticsConfig = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      const data = await response.json()
      if (data.success) {
        setAnalyticsConfig(data.data)
        initializeAnalytics(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar configuração Analytics:', error)
    }
  }, [initializeAnalytics])

  useEffect(() => {
    fetchAnalyticsConfig()
  }, [fetchAnalyticsConfig])

  const trackPageView = useCallback(() => {
    if (!analyticsConfig) return

    const url = `${window.location.origin}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

    if (analyticsConfig.googleAnalyticsId && window.gtag) {
      window.gtag('config', analyticsConfig.googleAnalyticsId, {
        page_path: pathname,
        page_title: document.title
      })
    }

    if (analyticsConfig.facebookPixelId && window.fbq) {
      window.fbq('track', 'PageView')
    }

    if (analyticsConfig.mixpanelToken) {
      window.mixpanel?.track('Page View', {
        page: pathname,
        url: url
      })
    }

    if (analyticsConfig.amplitudeApiKey) {
      window.amplitude?.getInstance().logEvent('Page View', {
        page: pathname,
        url: url
      })
    }
  }, [analyticsConfig, pathname, searchParams])

  useEffect(() => {
    if (analyticsConfig) {
      trackPageView()
    }
  }, [trackPageView, analyticsConfig])

  
  

  const loadGoogleAnalytics = (id: string) => {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args)
    }
    gtag('js', new Date())
    gtag('config', id)
    window.gtag = gtag
  }

  const loadGoogleTagManager = (id: string) => {
    const script = document.createElement('script')
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${id}');
    `
    document.head.appendChild(script)

    const noscript = document.createElement('noscript')
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
    document.body.insertBefore(noscript, document.body.firstChild)
  }

  const loadFacebookPixel = (id: string) => {
    const script = document.createElement('script')
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${id}');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)
  }

  const loadHotjar = (id: string) => {
    const script = document.createElement('script')
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${id},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `
    document.head.appendChild(script)
  }

  const loadMixpanel = (token: string) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
    script.onload = () => {
      window.mixpanel?.init?.(token as unknown as never)
    }
    document.head.appendChild(script)
  }

  const loadAmplitude = (apiKey: string) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.amplitude.com/libs/amplitude-8.21.0-min.gz.js'
    script.onload = () => {
      window.amplitude?.init?.(apiKey as unknown as never)
    }
    document.head.appendChild(script)
  }

  

  const trackEvent = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    if (!analyticsConfig) return

    // Google Analytics
    if (analyticsConfig.googleAnalyticsId && window.gtag) {
      window.gtag('event', eventName, properties)
    }

    // Facebook Pixel
    if (analyticsConfig.facebookPixelId && window.fbq) {
      window.fbq('track', eventName, properties)
    }

    if (analyticsConfig.mixpanelToken) {
      window.mixpanel?.track(eventName, properties)
    }

    if (analyticsConfig.amplitudeApiKey) {
      window.amplitude?.getInstance().logEvent(eventName, properties)
    }
  }, [analyticsConfig])

  // Expor função de tracking globalmente
  useEffect(() => {
    window.trackEvent = trackEvent
  }, [trackEvent])

  return <>{children}</>
}

// Hook para usar tracking em componentes
export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (window.trackEvent) {
      window.trackEvent(eventName, properties)
    }
  }

  const trackFormSubmission = (formName: string, properties?: Record<string, unknown>) => {
    trackEvent('Form Submission', {
      form_name: formName,
      ...properties
    })
  }

  const trackButtonClick = (buttonName: string, properties?: Record<string, unknown>) => {
    trackEvent('Button Click', {
      button_name: buttonName,
      ...properties
    })
  }

  const trackFileDownload = (fileName: string, properties?: Record<string, unknown>) => {
    trackEvent('File Download', {
      file_name: fileName,
      ...properties
    })
  }

  const trackOutboundLink = (url: string, properties?: Record<string, unknown>) => {
    trackEvent('Outbound Link', {
      url: url,
      ...properties
    })
  }

  return {
    trackEvent,
    trackFormSubmission,
    trackButtonClick,
    trackFileDownload,
    trackOutboundLink
  }
}

// Declarações de tipos globais
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
    fbq: (...args: unknown[]) => void
    mixpanel?: {
      init?: (token: string) => void
      track: (event: string, props?: Record<string, unknown>) => void
    }
    amplitude?: {
      init?: (apiKey: string) => void
      getInstance: () => { logEvent: (event: string, props?: Record<string, unknown>) => void }
    }
    trackEvent?: (eventName: string, properties?: Record<string, unknown>) => void
  }
}
