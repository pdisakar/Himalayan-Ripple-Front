import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * PROXY CONFIGURATION
 * 
 * This proxy provides security by blocking malicious requests and validating slugs.
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Slugs are cached for 24 hours in memory (no DB calls for most requests)
 * - 2-second timeout prevents slow API calls from blocking requests
 * - Stale cache is used if API is down/slow (graceful degradation)
 * - Static assets and known routes bypass slug validation entirely
 * 
 * To completely disable slug validation for maximum performance:
 * Set environment variable: DISABLE_PROXY_SLUG_CHECK=true
 * 
 * Note: Disabling slug validation means invalid URLs will reach your app,
 * but Next.js will still handle them with 404 pages. This is safe but less efficient.
 */

// In-memory cache for slugs
let cachedSlugs: Set<string> | null = null;
const FETCH_TIMEOUT = 2000; // 2 seconds timeout
const DISABLE_SLUG_CHECK = process.env.DISABLE_PROXY_SLUG_CHECK === 'true';

/**
 * Manual cache refresh function - call this to force refresh the slug cache
 * This will be triggered by your revalidation API endpoint
 */
export function clearSlugCache() {
  cachedSlugs = null;
  console.log('Proxy: Slug cache cleared manually');
}

async function getValidSlugs() {
  // Return cached slugs if available (no time-based expiration)
  if (cachedSlugs) {
    return cachedSlugs;
  }

  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('Proxy Warning: NEXT_PUBLIC_API_URL is not defined in production. Fallback to localhost might fail.');
      }
      apiUrl = 'http://localhost:3001/api';
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      const res = await fetch(`${apiUrl}/all-slugs`, { 
        signal: controller.signal,
        cache: 'no-store', // Don't cache at fetch level, we handle caching manually
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.error(`Proxy: Failed to fetch slugs. Status: ${res.status} ${res.statusText}`);
        // If we have old cached data, keep using it even if expired
        if (cachedSlugs) {
          console.warn('Proxy: Using stale cache due to fetch failure');
          return cachedSlugs;
        }
        return null;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        cachedSlugs = new Set(data.map((item: any) => item.slug));
        return cachedSlugs;
      }
      
      // If we have old cached data, keep using it
      if (cachedSlugs) {
        console.warn('Proxy: Using stale cache due to invalid response format');
        return cachedSlugs;
      }
      return null;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // If timeout or network error, use stale cache if available
      if (fetchError.name === 'AbortError') {
        console.warn('Proxy: Slug fetch timed out after 2s, using stale cache or failing open');
      } else {
        console.error('Proxy: Fetch error:', fetchError);
      }
      
      // Return stale cache if available, otherwise fail open
      if (cachedSlugs) {
        console.warn('Proxy: Using stale cache due to fetch error');
        return cachedSlugs;
      }
      return null;
    }
  } catch (error) {
    console.error('Proxy: Error in getValidSlugs', error);
    // Return stale cache if available
    if (cachedSlugs) {
      return cachedSlugs;
    }
    return null;
  }
}

// Helper for 404 rewrite
const notFoundRewrite = (url: string) => {
  return NextResponse.rewrite(new URL('/not-found', url));
};

export async function proxy(request: NextRequest) {
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
    // Skip slug validation if disabled via environment variable
    if (DISABLE_SLUG_CHECK) {
        return NextResponse.next();
    }

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
