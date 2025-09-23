import { NextRequest } from 'next/server'
import { healthHandler, metricsHandler, ResponseHelper } from '../monitoring-handlers'

// Handler para GET /api/monitoring/health
export async function GET(req: NextRequest) {
  const path = new URL(req.url).pathname
  
  const responseHelper: ResponseHelper = {
    json: (data: unknown) => new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }),
    status: (code: number) => ({
      json: (data: unknown) => new Response(JSON.stringify(data), {
        status: code,
        headers: { 'Content-Type': 'application/json' }
      })
    })
  }
  
  if (path.endsWith('/health')) {
    return healthHandler(req, responseHelper)
  }

  if (path.endsWith('/metrics')) {
    return metricsHandler(req, responseHelper)
  }

  return new Response('Not Found', { status: 404 })
}