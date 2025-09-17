import { BaseCarrierIntegration, CarrierRate, ShipmentData, ShipmentResponse, TrackingResponse } from './base-carrier'

export class UPSIntegration extends BaseCarrierIntegration {
  name = 'UPS'
  code = 'UPS'
  apiUrl = 'https://onlinetools.ups.com/api'

  protected async validateCredentials(): Promise<boolean> {
    try {
      // Teste básico de autenticação com UPS API
      await this.makeRequest('/rating/v1/Rate', {
        method: 'POST',
        body: JSON.stringify({
          RateRequest: {
            Request: {
              RequestOption: 'Rate',
              TransactionReference: {
                CustomerContext: 'Test Authentication'
              }
            }
          }
        })
      })
      return true
    } catch (error) {
      console.error('UPS authentication failed:', error)
      return false
    }
  }

  async getRates(weight: number, origin: string, destination: string): Promise<CarrierRate[]> {
    try {
      const response = await this.makeRequest('/rating/v1/Rate', {
        method: 'POST',
        body: JSON.stringify({
          RateRequest: {
            Request: {
              RequestOption: 'Rate',
              TransactionReference: {
                CustomerContext: 'Rate Request'
              }
            },
            Shipment: {
              Shipper: {
                Address: {
                  PostalCode: origin
                }
              },
              ShipTo: {
                Address: {
                  PostalCode: destination
                }
              },
              ShipFrom: {
                Address: {
                  PostalCode: origin
                }
              },
              Package: {
                PackagingType: {
                  Code: '02'
                },
                PackageWeight: {
                  Weight: weight.toString()
                }
              }
            }
          }
        })
      })

      const rates: CarrierRate[] = []

    const rateResponse = (response as Record<string, unknown>).RateResponse as Record<string, unknown>
    if (rateResponse?.RatedShipment) {
      const shipments = Array.isArray(rateResponse.RatedShipment)
        ? rateResponse.RatedShipment
        : [rateResponse.RatedShipment]

        for (const shipment of shipments) {
          rates.push({
            serviceType: shipment.Service?.Code || 'UNKNOWN',
            serviceName: this.getServiceName(shipment.Service?.Code),
            price: parseFloat(shipment.TotalCharges?.MonetaryValue || '0'),
            currency: shipment.TotalCharges?.CurrencyCode || 'USD',
            estimatedDays: this.getEstimatedDays(shipment.Service?.Code),
            trackingAvailable: true,
            insuranceAvailable: true
          })
        }
      }

      return rates
    } catch (error) {
      console.error('UPS rate request failed:', error)
      return []
    }
  }

  async createShipment(shipmentData: ShipmentData): Promise<ShipmentResponse> {
    try {
      const response = await this.makeRequest('/ship/v1/shipments', {
        method: 'POST',
        body: JSON.stringify({
          ShipmentRequest: {
            Request: {
              RequestOption: 'validate',
              TransactionReference: {
                CustomerContext: 'Shipment Request'
              }
            },
            Shipment: {
              Description: 'Package',
              Shipper: {
                Name: shipmentData.origin.name,
                Address: {
                  AddressLine: [shipmentData.origin.address1],
                  City: shipmentData.origin.city,
                  StateProvinceCode: shipmentData.origin.state,
                  PostalCode: shipmentData.origin.postalCode,
                  CountryCode: shipmentData.origin.country
                }
              },
              ShipTo: {
                Name: shipmentData.destination.name,
                Address: {
                  AddressLine: [shipmentData.destination.address1],
                  City: shipmentData.destination.city,
                  StateProvinceCode: shipmentData.destination.state,
                  PostalCode: shipmentData.destination.postalCode,
                  CountryCode: shipmentData.destination.country
                }
              },
              Service: {
                Code: shipmentData.serviceType
              },
              Package: {
                PackagingType: {
                  Code: '02'
                },
                PackageWeight: {
                  Weight: shipmentData.weight.toString()
                },
                Dimensions: {
                  Length: shipmentData.dimensions.length.toString(),
                  Width: shipmentData.dimensions.width.toString(),
                  Height: shipmentData.dimensions.height.toString()
                }
              }
            }
          }
        })
      })

      const shipmentResponse = (response as Record<string, unknown>).ShipmentResponse as Record<string, unknown>
      if (shipmentResponse?.ShipmentResults) {
        const shipment = shipmentResponse.ShipmentResults
        return {
          success: true,
          trackingNumber: (shipment as Record<string, unknown>).ShipmentIdentificationNumber as string,
          labelUrl: (((shipment as Record<string, unknown>).ShipmentDocuments as Record<string, unknown>)?.Image as Record<string, unknown>)?.GraphicImage as string
        }
      }

      return {
        success: false,
        error: 'Failed to create shipment'
      }
    } catch (error) {
      console.error('UPS shipment creation failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResponse> {
    try {
      const response = await this.makeRequest(`/track/v1/details/${trackingNumber}`, {
        method: 'GET'
      })

      const trackResponse = (response as Record<string, unknown>).TrackResponse as Record<string, unknown>
      if (trackResponse?.Shipment) {
        const shipment = trackResponse.Shipment
        const events = (((shipment as Record<string, unknown>).Package as Record<string, unknown>)?.Activity as Record<string, unknown>[])?.map((activity: Record<string, unknown>) => ({
          date: activity.Date as string,
          time: activity.Time as string,
          location: ((activity.ActivityLocation as Record<string, unknown>)?.Address as Record<string, unknown>)?.City as string || 'Unknown',
          description: (activity.Status as Record<string, unknown>)?.Description as string || 'Status update',
          status: (activity.Status as Record<string, unknown>)?.Type as string || 'Unknown'
        })) || []

        return {
          trackingNumber,
          status: ((((shipment as Record<string, unknown>).Package as Record<string, unknown>)?.Status as Record<string, unknown>)?.Type as string) || 'Unknown',
          events,
          estimatedDelivery: ((shipment as Record<string, unknown>).Package as Record<string, unknown>)?.DeliveryDate as string
        }
      }

      return {
        trackingNumber,
        status: 'Unknown',
        events: []
      }
    } catch (error) {
      console.error('UPS tracking failed:', error)
      return {
        trackingNumber,
        status: 'Error',
        events: []
      }
    }
  }

  async cancelShipment(trackingNumber: string): Promise<boolean> {
    try {
      await this.makeRequest(`/ship/v1/shipments/${trackingNumber}/cancel`, {
        method: 'DELETE'
      })
      return true
    } catch (error) {
      console.error('UPS cancellation failed:', error)
      return false
    }
  }

  private getServiceName(code: string): string {
    const serviceNames: { [key: string]: string } = {
      '01': 'UPS Next Day Air',
      '02': 'UPS 2nd Day Air',
      '03': 'UPS Ground',
      '12': 'UPS 3 Day Select',
      '13': 'UPS Next Day Air Saver',
      '14': 'UPS Next Day Air Early',
      '15': 'UPS Worldwide Express',
      '16': 'UPS Worldwide Expedited',
      '17': 'UPS Standard',
      '18': 'UPS Worldwide Express Plus',
      '19': 'UPS Worldwide Express',
      '20': 'UPS Worldwide Expedited',
      '21': 'UPS Express 12:00',
      '22': 'UPS Express 10:30',
      '23': 'UPS Express 9:00',
      '24': 'UPS Express 8:00',
      '25': 'UPS Express 7:00',
      '26': 'UPS Express 6:00',
      '27': 'UPS Express 5:00',
      '28': 'UPS Express 4:00',
      '29': 'UPS Express 3:00',
      '30': 'UPS Express 2:00',
      '31': 'UPS Express 1:00',
      '32': 'UPS Express 12:00',
      '33': 'UPS Express 10:30',
      '34': 'UPS Express 9:00',
      '35': 'UPS Express 8:00',
      '36': 'UPS Express 7:00',
      '37': 'UPS Express 6:00',
      '38': 'UPS Express 5:00',
      '39': 'UPS Express 4:00',
      '40': 'UPS Express 3:00',
      '41': 'UPS Express 2:00',
      '42': 'UPS Express 1:00',
      '43': 'UPS Express 12:00',
      '44': 'UPS Express 10:30',
      '45': 'UPS Express 9:00',
      '46': 'UPS Express 8:00',
      '47': 'UPS Express 7:00',
      '48': 'UPS Express 6:00',
      '49': 'UPS Express 5:00',
      '50': 'UPS Express 4:00',
      '51': 'UPS Express 3:00',
      '52': 'UPS Express 2:00',
      '53': 'UPS Express 1:00',
      '54': 'UPS Express 12:00',
      '55': 'UPS Express 10:30',
      '56': 'UPS Express 9:00',
      '57': 'UPS Express 8:00',
      '58': 'UPS Express 7:00',
      '59': 'UPS Express 6:00',
      '60': 'UPS Express 5:00',
      '61': 'UPS Express 4:00',
      '62': 'UPS Express 3:00',
      '63': 'UPS Express 2:00',
      '64': 'UPS Express 1:00',
      '65': 'UPS Express 12:00',
      '66': 'UPS Express 10:30',
      '67': 'UPS Express 9:00',
      '68': 'UPS Express 8:00',
      '69': 'UPS Express 7:00',
      '70': 'UPS Express 6:00',
      '71': 'UPS Express 5:00',
      '72': 'UPS Express 4:00',
      '73': 'UPS Express 3:00',
      '74': 'UPS Express 2:00',
      '75': 'UPS Express 1:00',
      '76': 'UPS Express 12:00',
      '77': 'UPS Express 10:30',
      '78': 'UPS Express 9:00',
      '79': 'UPS Express 8:00',
      '80': 'UPS Express 7:00',
      '81': 'UPS Express 6:00',
      '82': 'UPS Express 5:00',
      '83': 'UPS Express 4:00',
      '84': 'UPS Express 3:00',
      '85': 'UPS Express 2:00',
      '86': 'UPS Express 1:00',
      '87': 'UPS Express 12:00',
      '88': 'UPS Express 10:30',
      '89': 'UPS Express 9:00',
      '90': 'UPS Express 8:00',
      '91': 'UPS Express 7:00',
      '92': 'UPS Express 6:00',
      '93': 'UPS Express 5:00',
      '94': 'UPS Express 4:00',
      '95': 'UPS Express 3:00',
      '96': 'UPS Express 2:00',
      '97': 'UPS Express 1:00',
      '98': 'UPS Express 12:00',
      '99': 'UPS Express 10:30'
    }
    return serviceNames[code] || `UPS Service ${code}`
  }

  private getEstimatedDays(code: string): number {
    const estimatedDays: { [key: string]: number } = {
      '01': 1, // Next Day Air
      '02': 2, // 2nd Day Air
      '03': 5, // Ground
      '12': 3, // 3 Day Select
      '13': 1, // Next Day Air Saver
      '14': 1, // Next Day Air Early
      '15': 2, // Worldwide Express
      '16': 5, // Worldwide Expedited
      '17': 7, // Standard
      '18': 1, // Worldwide Express Plus
      '19': 2, // Worldwide Express
      '20': 5, // Worldwide Expedited
      '21': 1, // Express 12:00
      '22': 1, // Express 10:30
      '23': 1, // Express 9:00
      '24': 1, // Express 8:00
      '25': 1, // Express 7:00
      '26': 1, // Express 6:00
      '27': 1, // Express 5:00
      '28': 1, // Express 4:00
      '29': 1, // Express 3:00
      '30': 1, // Express 2:00
      '31': 1, // Express 1:00
    }
    return estimatedDays[code] || 5
  }
}
