import NextAuth from 'next-auth';

import { applyTokenToSession } from '$libs/auth/callbacks';
import { authProvidersConfig } from '$libs/auth/config';
import { hasSomeRoles, isAdmin } from '$libs/auth/roles';
import { getPrivatePathRoles, ROUTES } from '$libs/auth/routes';
import { getFlashMessage } from '$utils/get-flash-message';

const { auth } = NextAuth({
  ...authProvidersConfig,

  callbacks: {
    session({ token, session }) {
      if (token && session.user) {
        return applyTokenToSession(token, session);
      }

      return session;
    },
  },
});

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

  if (isLoggedIn && !isAuthRoute) {
    const routeRoles = getPrivatePathRoles(req.nextUrl.pathname);
    const user = req.auth!.user;

    if (!user || !user.roles) {
      return;
    }

    if (routeRoles.length === 0 || isAdmin(user)) {
      return;
    }

    const userHasRoles = hasSomeRoles(user, ...routeRoles);

    if (!userHasRoles) {
      const homeUrl = new URL(ROUTES.private.home.path, req.nextUrl);

      const message = getFlashMessage(
        'warning',
        'Você não tem permissão para acessar essa página.',
      );

      return Response.redirect(`${homeUrl}?${message}`);
    }
  }

  return;
});

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
