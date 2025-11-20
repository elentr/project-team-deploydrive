import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Маршруты, куда НЕ должен попадать авторизованный пользователь
const authRoutes = ['/auth/login', '/auth/register'] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Мы НЕ используем token cookie для защиты!
  // Просто проверяем – если cookie есть, то это значит, что пользователь авторизован на сервере
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = Boolean(token);

  const isAuthRoute = authRoutes.includes(
    pathname as (typeof authRoutes)[number]
  );

  // Авторизованный → пытается попасть на /auth/login или /auth/register → перекидываем на главную
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Всё остальное пропускаем
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
