import NextAuth from 'next-auth';

import { sharedConfig } from '$libs/auth';
import { ROUTES } from '$libs/auth/routes';

const { auth } = NextAuth(sharedConfig);

const authRoutes = Object.values(ROUTES.auth);

export default auth((req) => {
  const isApiAuthRouter = req.nextUrl.pathname.startsWith('/api/auth');

  if (isApiAuthRouter) {
    return;
  }

  const isLoggedIn = !!req.auth;

  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(ROUTES.private.home.path, req.nextUrl));
    }

    return;
  }

  const isPublicRoute = ROUTES.public.includes(req.nextUrl.pathname);

  if (!isLoggedIn && !isAuthRoute && !isPublicRoute) {
    const loginUrl = new URL(ROUTES.auth.login, req.nextUrl);

    loginUrl.searchParams.set('redirectTo', encodeURI(req.nextUrl.pathname));

    return Response.redirect(loginUrl);
  }

  return;
});

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
