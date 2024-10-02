import NextAuth from 'next-auth';

import { ROUTES, sharedConfig } from '$libs/auth';

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

  if (!isLoggedIn && !isAuthRoute) {
    return Response.redirect(new URL(ROUTES.auth.login, req.nextUrl));
  }

  return;
});

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
