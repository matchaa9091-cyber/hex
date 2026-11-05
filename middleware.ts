import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // 1. Domain Migration: Force redirect from ANY .xyz variant to .com
  if (host.includes('hexescortsug.xyz')) {
    const newUrl = new URL(pathname, 'https://www.hexescortsug.com');
    request.nextUrl.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(newUrl, 301);
  }

  // 2. WWW Canonical Enforcement (force hexescortsug.com -> www.hexescortsug.com)
  if (host === 'hexescortsug.com') {
    const newUrl = new URL(pathname, 'https://www.hexescortsug.com');
    request.nextUrl.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(newUrl, 301);
  }

  // Protect the admin route — redirect to home if not authenticated via Supabase session cookie
  if (pathname.startsWith('/admin-panel')) {
    return NextResponse.redirect(new URL('/hx-ctrl-7k9', request.url));
  }

  // SEO Redirect: Old /location/ routes to new /escorts-in/ routes
  if (pathname.startsWith('/location/')) {
    const newPath = pathname.replace('/location/', '/escorts-in/');
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }

  const res = NextResponse.next();
  if (
    request.method === 'GET' &&
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/hx-ctrl') &&
    !pathname.startsWith('/admin')
  ) {
    res.headers.set('Cloudflare-CDN-Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
    res.headers.set('CDN-Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
  }
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets with extensions (png, jpg, jpeg, gif, webp, svg, ico, mp4, mov)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|mov)$).*)',
  ], 
};

