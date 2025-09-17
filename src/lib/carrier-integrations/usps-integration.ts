import { BaseCarrierIntegration, CarrierRate, ShipmentData, ShipmentResponse, TrackingResponse } from './base-carrier'

export class USPSIntegration extends BaseCarrierIntegration {
  name = 'USPS'
  code = 'USPS'
  apiUrl = 'https://secure.shippingapis.com/ShippingAPI.dll'

  protected async validateCredentials(): Promise<boolean> {
    try {
      // Teste básico de autenticação com USPS API
      await this.makeRequest('?API=TrackV2&XML=<TrackRequest USERID="' + this.apiKey + '"><TrackID ID="1Z999AA1234567890"></TrackID></TrackRequest>', {
        method: 'GET'
      })
      return true
    } catch (error) {
      console.error('USPS authentication failed:', error)
      return false
    }
  }

  async getRates(weight: number, origin: string, destination: string, serviceType?: string): Promise<CarrierRate[]> {
    try {
      const xml = `
        <RateV4Request USERID="${this.apiKey}">
          <Revision>2</Revision>
          <Package ID="1">
            <Service>${serviceType || 'PRIORITY'}</Service>
            <ZipOrigination>${origin}</ZipOrigination>
            <ZipDestination>${destination}</ZipDestination>
            <Pounds>${Math.floor(weight / 16)}</Pounds>
            <Ounces>${weight % 16}</Ounces>
            <Container>VARIABLE</Container>
            <Size>REGULAR</Size>
            <Machinable>TRUE</Machinable>
          </Package>
        </RateV4Request>
      `

      const response = await this.makeRequest(`?API=RateV4&XML=${encodeURIComponent(xml)}`, {
        method: 'GET'
      })

      const rates: CarrierRate[] = []

      // Parse XML response (simplified)
      if ((response as unknown as string).includes('<RateV4Response>')) {
        const serviceMatch = (response as unknown as string).match(/<Service>([^<]+)<\/Service>/)
        const rateMatch = (response as unknown as string).match(/<Rate>([^<]+)<\/Rate>/)

        if (serviceMatch && rateMatch) {
          rates.push({
            serviceType: serviceMatch[1],
            serviceName: this.getServiceName(serviceMatch[1]),
            price: parseFloat(rateMatch[1]),
            currency: 'USD',
            estimatedDays: this.getEstimatedDays(serviceMatch[1]),
            trackingAvailable: true,
            insuranceAvailable: true
          })
        }
      }

      return rates
    } catch (error) {
      console.error('USPS rate request failed:', error)
      return []
    }
  }

  async createShipment(shipmentData: ShipmentData): Promise<ShipmentResponse> {
    try {
      const xml = `
        <eVSRequest USERID="${this.apiKey}">
          <Revision>1</Revision>
          <FromName>${shipmentData.origin.name}</FromName>
          <FromFirm>${shipmentData.origin.company || ''}</FromFirm>
          <FromAddress1>${shipmentData.origin.address1}</FromAddress1>
          <FromAddress2>${shipmentData.origin.address2 || ''}</FromAddress2>
          <FromCity>${shipmentData.origin.city}</FromCity>
          <FromState>${shipmentData.origin.state}</FromState>
          <FromZip5>${shipmentData.origin.postalCode.substring(0, 5)}</FromZip5>
          <FromZip4>${shipmentData.origin.postalCode.substring(5) || ''}</FromZip4>
          <ToName>${shipmentData.destination.name}</ToName>
          <ToFirm>${shipmentData.destination.company || ''}</ToFirm>
          <ToAddress1>${shipmentData.destination.address1}</ToAddress1>
          <ToAddress2>${shipmentData.destination.address2 || ''}</ToAddress2>
          <ToCity>${shipmentData.destination.city}</ToCity>
          <ToState>${shipmentData.destination.state}</ToState>
          <ToZip5>${shipmentData.destination.postalCode.substring(0, 5)}</ToZip5>
          <ToZip4>${shipmentData.destination.postalCode.substring(5) || ''}</ToZip4>
          <WeightInOunces>${shipmentData.weight}</WeightInOunces>
          <ServiceType>${shipmentData.serviceType}</ServiceType>
          <Container>VARIABLE</Container>
          <Size>REGULAR</Size>
          <Width>${shipmentData.dimensions.width}</Width>
          <Length>${shipmentData.dimensions.length}</Length>
          <Height>${shipmentData.dimensions.height}</Height>
          <Machinable>TRUE</Machinable>
        </eVSRequest>
      `

      const response = await this.makeRequest(`?API=eVS&XML=${encodeURIComponent(xml)}`, {
        method: 'GET'
      })

      // Parse XML response (simplified)
      if ((response as unknown as string).includes('<eVSResponse>')) {
        const trackingMatch = (response as unknown as string).match(/<BarcodeNumber>([^<]+)<\/BarcodeNumber>/)
        const labelMatch = (response as unknown as string).match(/<Postnet>([^<]+)<\/Postnet>/)

        if (trackingMatch) {
          return {
            success: true,
            trackingNumber: trackingMatch[1],
            labelUrl: labelMatch ? labelMatch[1] : undefined
          }
        }
      }

      return {
        success: false,
        error: 'Failed to create shipment'
      }
    } catch (error) {
      console.error('USPS shipment creation failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResponse> {
    try {
      const xml = `
        <TrackRequest USERID="${this.apiKey}">
          <TrackID ID="${trackingNumber}"></TrackID>
        </TrackRequest>
      `

      const response = await this.makeRequest(`?API=TrackV2&XML=${encodeURIComponent(xml)}`, {
        method: 'GET'
      })

      // Parse XML response (simplified)
      if ((response as unknown as string).includes('<TrackResponse>')) {
        const statusMatch = (response as unknown as string).match(/<Status>([^<]+)<\/Status>/)
        const summaryMatch = (response as unknown as string).match(/<StatusSummary>([^<]+)<\/StatusSummary>/)

        const events = []
        if (summaryMatch) {
          events.push({
            date: new Date().toISOString().split('T')[0],
            time: new Date().toISOString().split('T')[1].split('.')[0],
            location: 'USPS Facility',
            description: summaryMatch[1],
            status: statusMatch ? statusMatch[1] : 'Unknown'
          })
        }

        return {
          trackingNumber,
          status: statusMatch ? statusMatch[1] : 'Unknown',
          events
        }
      }

      return {
        trackingNumber,
        status: 'Unknown',
        events: []
      }
    } catch (error) {
      console.error('USPS tracking failed:', error)
      return {
        trackingNumber,
        status: 'Error',
        events: []
      }
    }
  }

  async cancelShipment(trackingNumber: string): Promise<boolean> {
    try {
      // USPS doesn't have a direct cancellation API
      // This would typically require contacting USPS directly
      console.log(`USPS shipment ${trackingNumber} cancellation requested`)
      return true
    } catch (error) {
      console.error('USPS cancellation failed:', error)
      return false
    }
  }

  private getServiceName(code: string): string {
    const serviceNames: { [key: string]: string } = {
      'PRIORITY': 'USPS Priority Mail',
      'PRIORITY_EXPRESS': 'USPS Priority Mail Express',
      'FIRST_CLASS': 'USPS First-Class Mail',
      'GROUND_ADVANTAGE': 'USPS Ground Advantage',
      'MEDIA_MAIL': 'USPS Media Mail',
      'LIBRARY_MAIL': 'USPS Library Mail',
      'PARCEL_SELECT': 'USPS Parcel Select',
      'PARCEL_SELECT_GROUND': 'USPS Parcel Select Ground',
      'STANDARD_POST': 'USPS Standard Post',
      'BOUND_PRINTED_MATTER': 'USPS Bound Printed Matter',
      'PRIORITY_MAIL_INTERNATIONAL': 'USPS Priority Mail International',
      'PRIORITY_MAIL_EXPRESS_INTERNATIONAL': 'USPS Priority Mail Express International',
      'FIRST_CLASS_MAIL_INTERNATIONAL': 'USPS First-Class Mail International',
      'GLOBAL_EXPRESS_GUARANTEED': 'USPS Global Express Guaranteed',
      'GLOBAL_EXPRESS_GUARANTEED_DOCUMENTS': 'USPS Global Express Guaranteed Documents',
      'GLOBAL_EXPRESS_GUARANTEED_NON_DOCUMENTS': 'USPS Global Express Guaranteed Non-Documents',
      'GLOBAL_PRIORITY_MAIL': 'USPS Global Priority Mail',
      'GLOBAL_PRIORITY_MAIL_EXPRESS': 'USPS Global Priority Mail Express',
      'GLOBAL_PRIORITY_MAIL_EXPRESS_DOCUMENTS': 'USPS Global Priority Mail Express Documents',
      'GLOBAL_PRIORITY_MAIL_EXPRESS_NON_DOCUMENTS': 'USPS Global Priority Mail Express Non-Documents',
      'GLOBAL_PRIORITY_MAIL_DOCUMENTS': 'USPS Global Priority Mail Documents',
      'GLOBAL_PRIORITY_MAIL_NON_DOCUMENTS': 'USPS Global Priority Mail Non-Documents'
    }
    return serviceNames[code] || `USPS Service ${code}`
  }

  private getEstimatedDays(code: string): number {
    const estimatedDays: { [key: string]: number } = {
      'PRIORITY': 3,
      'PRIORITY_EXPRESS': 1,
      'FIRST_CLASS': 5,
      'GROUND_ADVANTAGE': 5,
      'MEDIA_MAIL': 8,
      'LIBRARY_MAIL': 8,
      'PARCEL_SELECT': 7,
      'PARCEL_SELECT_GROUND': 7,
      'STANDARD_POST': 7,
      'BOUND_PRINTED_MATTER': 7,
      'PRIORITY_MAIL_INTERNATIONAL': 10,
      'PRIORITY_MAIL_EXPRESS_INTERNATIONAL': 3,
      'FIRST_CLASS_MAIL_INTERNATIONAL': 14,
      'GLOBAL_EXPRESS_GUARANTEED': 1,
      'GLOBAL_EXPRESS_GUARANTEED_DOCUMENTS': 1,
      'GLOBAL_EXPRESS_GUARANTEED_NON_DOCUMENTS': 1,
      'GLOBAL_PRIORITY_MAIL': 7,
      'GLOBAL_PRIORITY_MAIL_EXPRESS': 3,
      'GLOBAL_PRIORITY_MAIL_EXPRESS_DOCUMENTS': 3,
      'GLOBAL_PRIORITY_MAIL_EXPRESS_NON_DOCUMENTS': 3,
      'GLOBAL_PRIORITY_MAIL_DOCUMENTS': 7,
      'GLOBAL_PRIORITY_MAIL_NON_DOCUMENTS': 7
    }
    return estimatedDays[code] || 5
  }
}
