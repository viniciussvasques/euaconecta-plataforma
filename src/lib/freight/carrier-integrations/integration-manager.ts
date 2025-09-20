import { CarrierIntegration, ShipmentData } from './base-carrier'
import { UPSIntegration } from './ups-integration'
import { USPSIntegration } from './usps-integration'
import { prisma } from '@/lib/database/prisma'

export class CarrierIntegrationManager {
  private integrations: Map<string, CarrierIntegration> = new Map()

  constructor() {
    // Registrar integrações disponíveis
    this.registerIntegration(new UPSIntegration())
    this.registerIntegration(new USPSIntegration())
    // Adicionar outras integrações aqui (FedEx, DHL, etc.)
  }

  private registerIntegration(integration: CarrierIntegration) {
    this.integrations.set(integration.code, integration)
  }

  async getAvailableIntegrations(): Promise<CarrierIntegration[]> {
    return Array.from(this.integrations.values())
  }

  async getIntegration(carrierCode: string): Promise<CarrierIntegration | null> {
    return this.integrations.get(carrierCode) || null
  }

  async authenticateCarrier(carrierId: string): Promise<boolean> {
    try {
      const carrier = await prisma.carrier.findUnique({
        where: { id: carrierId }
      })

      if (!carrier || !carrier.hasApi || !carrier.apiKey || !carrier.apiSecret) {
        return false
      }

      const integration = await this.getIntegration(carrier.code)
      if (!integration) {
        return false
      }

      return await integration.authenticate(carrier.apiKey, carrier.apiSecret)
    } catch (error) {
      console.error('Carrier authentication failed:', error)
      return false
    }
  }

  async testCarrierConnection(carrierId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const carrier = await prisma.carrier.findUnique({
        where: { id: carrierId }
      })

      if (!carrier) {
        return { success: false, error: 'Transportadora não encontrada' }
      }

      if (!carrier.hasApi) {
        return { success: false, error: 'Transportadora não possui integração API' }
      }

      if (!carrier.apiKey || !carrier.apiSecret) {
        return { success: false, error: 'Credenciais da API não configuradas' }
      }

      const integration = await this.getIntegration(carrier.code)
      if (!integration) {
        return { success: false, error: 'Integração não disponível para esta transportadora' }
      }

      const authenticated = await integration.authenticate(carrier.apiKey, carrier.apiSecret)
      
      if (authenticated) {
        return { success: true }
      } else {
        return { success: false, error: 'Falha na autenticação com a API da transportadora' }
      }
    } catch (error) {
      console.error('Carrier connection test failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }
    }
  }

  async getCarrierRates(carrierId: string, weight: number, origin: string, destination: string, serviceType?: string) {
    try {
      const carrier = await prisma.carrier.findUnique({
        where: { id: carrierId }
      })

      if (!carrier || !carrier.hasApi) {
        return []
      }

      const integration = await this.getIntegration(carrier.code)
      if (!integration) {
        return []
      }

      await integration.authenticate(carrier.apiKey!, carrier.apiSecret!)
      return await integration.getRates(weight, origin, destination, serviceType)
    } catch (error) {
      console.error('Get carrier rates failed:', error)
      return []
    }
  }

  async createCarrierShipment(carrierId: string, shipmentData: ShipmentData) {
    try {
      const carrier = await prisma.carrier.findUnique({
        where: { id: carrierId }
      })

      if (!carrier || !carrier.hasApi) {
        return { success: false, error: 'Transportadora não possui integração API' }
      }

      const integration = await this.getIntegration(carrier.code)
      if (!integration) {
        return { success: false, error: 'Integração não disponível' }
      }

      await integration.authenticate(carrier.apiKey!, carrier.apiSecret!)
      return await integration.createShipment(shipmentData)
    } catch (error) {
      console.error('Create carrier shipment failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }
    }
  }

  async trackCarrierShipment(carrierId: string, trackingNumber: string) {
    try {
      const carrier = await prisma.carrier.findUnique({
        where: { id: carrierId }
      })

      if (!carrier || !carrier.hasApi) {
        return { success: false, error: 'Transportadora não possui integração API' }
      }

      const integration = await this.getIntegration(carrier.code)
      if (!integration) {
        return { success: false, error: 'Integração não disponível' }
      }

      await integration.authenticate(carrier.apiKey!, carrier.apiSecret!)
      return await integration.trackShipment(trackingNumber)
    } catch (error) {
      console.error('Track carrier shipment failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }
    }
  }
}

export const carrierIntegrationManager = new CarrierIntegrationManager()
