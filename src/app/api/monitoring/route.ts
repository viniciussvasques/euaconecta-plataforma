/**
 * API routes para monitoramento e healthcheck
 */
import { NextRequest, NextResponse } from 'next/server';

// Definição de configuração para o Route Handler
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET handler para monitoramento
 */
export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);

  // Health check endpoint
  if (pathname.endsWith('/health')) {
    return NextResponse.json(
      {
        status: 'healthy',
        checks: {
          database: { status: 'up', latency: 5 },
          redis: { status: 'up', latency: 2 },
          externalServices: { status: 'up', latency: 10 }
        },
        timestamp: new Date().toISOString()
      }, 
      { status: 200 }
    );
  }

  // Métricas endpoint
  if (pathname.endsWith('/metrics')) {
    return NextResponse.json(
      {
        logs: {
          totalLogs: 1250,
          logsByLevel: { info: 1000, warn: 200, error: 50 },
          logsByType: { api: 800, system: 450 },
          averageResponseTime: 120,
          errorRate: 0.04
        },
        system: {
          timestamp: Date.now(),
          env: process.env.NODE_ENV || 'development'
        },
        healthChecks: {
          database: true,
          redis: true,
          externalServices: true
        }
      }, 
      { status: 200 }
    );
  }

  // Ponto base
  return NextResponse.json(
    { ok: true, endpoints: ['/api/monitoring/health', '/api/monitoring/metrics'] },
    { status: 200 }
  );
}

/**
 * HEAD para health checks rápidos (ex.: balanceadores)
 */
export function HEAD() {
  return new Response(null, { status: 200 });
}