import { NextRequest, NextResponse } from 'next/server'

// This middleware ensures the public images folder is read-only from the web.
// It blocks any non-GET/HEAD requests to /images/* with 405 Method Not Allowed.
export function middleware(req: NextRequest) {
  const method = req.method

  // Allow safe methods only for static assets
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    return new NextResponse(
      JSON.stringify({ error: 'Method Not Allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Allow': 'GET, HEAD, OPTIONS',
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  return NextResponse.next()
}

// Apply only to requests for static images served from public/images
export const config = {
  matcher: ['/images/:path*'],
}
