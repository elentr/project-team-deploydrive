// middleware.ts (корінь проєкту)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/profile',
  '/stories/create',
  '/stories/edit',
  '/saved',
  '/settings',
] as const;

const authRoutes = ['/auth/login', '/auth/register'] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Беремо куки правильно — з request.cookies (це єдиний спосіб у middleware)
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = Boolean(token);

  // Перевірка: чи це захищений роут?
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Перевірка: чи це сторінка входу/реєстрації?
  const isAuthRoute = authRoutes.includes(
    pathname as (typeof authRoutes)[number]
  );

  // 1. Неавторизований → захищений роут → редирект на логін
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Авторизований → сторінка логіну/реєстрації → на головну
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Усе інше — пропускаємо
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/stories/create',
    '/stories/edit/:path*',
    '/saved/:path*',
    '/settings/:path*',
    '/auth/login',
    '/auth/register',
  ],
};
