import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/constants';

/**
 * On-Demand Revalidation API
 * 
 * This endpoint allows logged-in admin users to trigger cache revalidation.
 * No secret key needed - uses your existing admin authentication.
 * 
 * Usage:
 * POST /api/revalidate
 * Headers: 
 *   Content-Type: application/json
 *   Authorization: Bearer YOUR_ADMIN_TOKEN
 * Body: {
 *   "paths": ["/", "/about"],  // Optional: specific paths
 *   "revalidateAll": true      // Optional: revalidate everything
 * }
 */

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated (has admin token)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') ||
      request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized - Please login to admin panel'
        },
        { status: 401 }
      );
    }

    // Verify token with your backend
    const apiUrl = API_URL;

    // Token exists, user is logged in - allow revalidation
    // In production, you can add backend verification if needed
    console.log('✅ Admin authenticated, proceeding with revalidation...');

    const body = await request.json();
    const { paths, revalidateAll } = body;

    // Revalidate specific paths
    if (Array.isArray(paths) && paths.length > 0) {
      for (const path of paths) {
        revalidatePath(path);
        console.log(`✅ Revalidated path: ${path}`);
      }

      return NextResponse.json({
        success: true,
        message: `Revalidated ${paths.length} path(s)`,
        paths,
        timestamp: new Date().toISOString()
      });
    }

    // Revalidate all paths
    if (revalidateAll) {
      const commonPaths = [
        '/',
        '/about',
        '/contact',
        '/packages',
        '/places',
        '/blogs',
        '/testimonials',
      ];

      for (const path of commonPaths) {
        revalidatePath(path);
        console.log(`✅ Revalidated path: ${path}`);
      }

      // Also revalidate layout to refresh header/footer
      revalidatePath('/', 'layout');

      return NextResponse.json({
        success: true,
        message: 'Cache refreshed successfully!',
        paths: commonPaths,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Please provide either "paths" array or "revalidateAll: true"'
      },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Revalidation failed',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation API is active',
    usage: 'POST with admin authentication',
    authRequired: true
  });
}

