// Interface base para integrações com transportadoras
export interface CarrierIntegration {
  name: string
  code: string
  apiUrl: string
  authenticate(apiKey: string, apiSecret: string): Promise<boolean>
  getRates(weight: number, origin: string, destination: string, serviceType?: string): Promise<CarrierRate[]>
  createShipment(shipmentData: ShipmentData): Promise<ShipmentResponse>
  trackShipment(trackingNumber: string): Promise<TrackingResponse>
  cancelShipment(trackingNumber: string): Promise<boolean>
}

export interface CarrierRate {
  serviceType: string
  serviceName: string
  price: number
  currency: string
  estimatedDays: number
  trackingAvailable: boolean
  insuranceAvailable: boolean
}

export interface ShipmentData {
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  origin: Address
  destination: Address
  serviceType: string
  declaredValue?: number
  insurance?: boolean
}

export interface Address {
  name: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  email?: string
}

export interface ShipmentResponse {
  success: boolean
  trackingNumber?: string
  labelUrl?: string
  error?: string
}

export interface TrackingResponse {
  trackingNumber: string
  status: string
  events: TrackingEvent[]
  estimatedDelivery?: string
}

export interface TrackingEvent {
  date: string
  time: string
  location: string
  description: string
  status: string
}

// Classe base abstrata para integrações
export abstract class BaseCarrierIntegration implements CarrierIntegration {
  abstract name: string
  abstract code: string
  abstract apiUrl: string

  protected apiKey: string = ''
  protected apiSecret: string = ''

  async authenticate(apiKey: string, apiSecret: string): Promise<boolean> {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    return this.validateCredentials()
  }

  protected abstract validateCredentials(): Promise<boolean>
  abstract getRates(weight: number, origin: string, destination: string, serviceType?: string): Promise<CarrierRate[]>
  abstract createShipment(shipmentData: ShipmentData): Promise<ShipmentResponse>
  abstract trackShipment(trackingNumber: string): Promise<TrackingResponse>
  abstract cancelShipment(trackingNumber: string): Promise<boolean>

  protected async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Record<string, unknown>> {
    const url = `${this.apiUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}
