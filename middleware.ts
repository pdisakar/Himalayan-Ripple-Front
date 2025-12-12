import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory cache for slugs
let cachedSlugs: Set<string> | null = null;
let lastFetchTime = 0;
const REVALIDATE_TIME = 3600 * 1000; // 1 hour

async function getValidSlugs() {
  const now = Date.now();
  if (cachedSlugs && (now - lastFetchTime < REVALIDATE_TIME)) {
    return cachedSlugs;
  }

  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('Middleware Warning: NEXT_PUBLIC_API_URL is not defined in production. Fallback to localhost might fail.');
      }
      apiUrl = 'http://localhost:3001/api';
    }
    const res = await fetch(`${apiUrl}/all-slugs`, { next: { revalidate: 0 } });
    if (!res.ok) {
      console.error(`Middleware: Failed to fetch slugs. Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error('Middleware: Response body:', text);
      return null;
    }
    const data = await res.json();
    if (Array.isArray(data)) {
        cachedSlugs = new Set(data.map((item: any) => item.slug));
        lastFetchTime = now;
        return cachedSlugs;
    }
    return null;
  } catch (error) {
    console.error('Middleware: Error fetching slugs', error);
    return null;
  }
}

// Helper for 404 rewrite
const notFoundRewrite = (url: string) => {
  return NextResponse.rewrite(new URL('/not-found', url));
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const lowerPath = pathname.toLowerCase();

    // =========================================================
    // 1. GLOBAL BLOCK LIST (Bad Bots / Scanners)
    // =========================================================
    const blockedExtensions = ['.php', '.aspx', '.asp', '.env', '.ini', '.git', '.sh', '.yaml', '.yml', '.sql', '.jsp'];
    if (blockedExtensions.some(ext => lowerPath.endsWith(ext))) {
         return notFoundRewrite(request.url);
    }

    const blockedKeywords = ['/wp-admin', '/wp-login', '/laravel', '/telescope', '/phpmyadmin', '/vendor', '/cgi-bin', 'web.config'];
    if (blockedKeywords.some(keyword => lowerPath.includes(keyword))) {
         return notFoundRewrite(request.url);
    }

    // =========================================================
    // 2. STATIC ASSETS & NEXT.JS INTERNALS (Always Allow)
    // =========================================================
    if (
        lowerPath.startsWith('/_next') ||
        lowerPath.startsWith('/images') ||
        lowerPath.startsWith('/uploads') ||
        lowerPath.startsWith('/favicon.ico') ||
        lowerPath.startsWith('/robots.txt') ||
        lowerPath.startsWith('/sitemap') ||
        lowerPath.endsWith('.svg') ||
        lowerPath.endsWith('.png') ||
        lowerPath.endsWith('.jpg') ||
        lowerPath.endsWith('.jpeg') ||
        lowerPath.endsWith('.webp') ||
        lowerPath.endsWith('.gif')
    ) {
        return NextResponse.next();
    }

    // =========================================================
    // 3. STATIC ROUTES ALLOWLIST (Hardcoded Pages)
    // =========================================================
    // Add your static routes here. These are pages that exist as files in /app
    const staticRoutes = [
        '/',
        '/about',
        '/about-us',
        '/contact',
        '/contact-us',
        '/blog', // blog list
        '/blogs',
        '/packages', // package list
        '/places',
        '/testimonials', // testimonials list
        '/team',
        '/teams', // if you have teams page
        '/admin', // Protect admin separately? Or allow it?
        '/login',
        '/not-found' // Allow the 404 page itself!
    ];

    // Allow static routes (exact match or starting with for sub-routes like /admin)
    if (staticRoutes.includes(lowerPath) || lowerPath.startsWith('/admin') || lowerPath.startsWith('/testimonials/')) {
        return NextResponse.next();
    }

    // =========================================================
    // 4. DYNAMIC SLUG CHECK (Strict Mode)
    // =========================================================
    const validSlugs = await getValidSlugs();

    // If fetch failed (DB down), FAIL OPEN (Allow traffic to dynamic page to handle 404 itself or show content)
    // This is safer than blocking everything if the API is momentarily offline.
    if (!validSlugs) {
        return NextResponse.next();
    }

    // Extract the potential slug from the path
    // Assuming structure is /{slug} for most dynamic content
    const pathParts = pathname.split('/').filter(Boolean);
    
    // If it's a root level slug like /everest-base-camp
    if (pathParts.length === 1) {
        const potentialSlug = pathParts[0];
        if (validSlugs.has(potentialSlug)) {
             return NextResponse.next();
        } else {
             // BLOCK: It's a single segment path that IS NOT in our slug list, and NOT in static routes
             // e.g. /random-nonsense or /old-page
             return notFoundRewrite(request.url);
        }
    }
    
    // If deeper path, we allow for now (OR you can restrict deeper paths too if you know them)
    // e.g. /packages/some-slug -> if you use rewriting, but you seem to use root logic or specific folders.
    // Based on `[slug]/page.tsx`, you serve verify robustly.
    
    return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
