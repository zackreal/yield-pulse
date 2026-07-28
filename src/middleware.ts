import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-development';

// Public paths that do not require authentication
const publicRoutes = ['/login', '/register', '/api/v1/auth/login', '/api/v1/auth/register', '/favicon.ico'];
// Internal next paths and static assets are handled by config.matcher anyway, but good to be explicit

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if it's a public route
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  
  // Get token from cookie
  const token = req.cookies.get('auth_token')?.value;

  // If trying to access login/register while authenticated, redirect to dashboard
  if (isPublic && pathname.match(/^\/(login|register)/) && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If public route, let it pass
  if (isPublic) {
    return NextResponse.next();
  }

  // If not public and no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Verify token using jose (Edge compatible)
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // RBAC Checks
    const role = payload.role as string;

    // SUPER_ADMIN has access to everything.
    
    // POS_CASHIER can only access /pos
    if (role === 'POS_CASHIER' && !pathname.startsWith('/pos')) {
      return NextResponse.redirect(new URL('/pos', req.url));
    }

    // Only SUPER_ADMIN can access /admin
    if (pathname.startsWith('/admin') && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Only SUPER_ADMIN and STORE_MANAGER can access /settings
    if (pathname.startsWith('/settings') && !['SUPER_ADMIN', 'STORE_MANAGER'].includes(role)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Pass the request
    return NextResponse.next();

  } catch (error) {
    console.error('Invalid JWT signature or expired:', error);
    // Delete invalid cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
