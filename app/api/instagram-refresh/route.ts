import { refreshInstagramToken } from '@/lib/instagram'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const newToken = await refreshInstagramToken()
    console.log('[instagram-refresh] New token:', newToken)
    return NextResponse.json({ success: true, tokenPreview: `${newToken.slice(0, 8)}...${newToken.slice(-8)}` })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}