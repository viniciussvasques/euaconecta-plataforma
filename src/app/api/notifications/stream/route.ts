import { NextRequest } from 'next/server'
import { handleSSEConnection } from '@/lib/notifications-sse'

export async function GET(request: NextRequest) {
  return handleSSEConnection(request)
}
