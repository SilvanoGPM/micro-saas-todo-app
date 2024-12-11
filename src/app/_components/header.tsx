'use client';

import { Session } from 'next-auth';
import Link from 'next/link';

import { Logo } from '$components/logo';
import { ToggleThemeButton } from '$components/toggle-theme';
import { Avatar, AvatarFallback, AvatarImage } from '$components/ui/avatar';
import { Button } from '$components/ui/button';
import { ROUTES } from '$libs/auth/routes';

export interface LandingPageHeaderProps {
  user?: Session['user'];
}

export function LandingPageHeader({ user }: LandingPageHeaderProps) {
  return (
    <>
      <div className="w-full h-20" />

      <header className="fixed top-0 h-20 left-0 right-0 z-20 border-b bg-background bg-opacity-10">
        <div className="h-full flex items-center justify-between gap-4 container">
          <a href="/">
            <Logo />
          </a>

          <div className="flex gap-4">
            {user ? (
              <Link href={ROUTES.private.home.path}>
                <Avatar>
                  <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <>
                <Button size="sm" asChild>
                  <Link href={ROUTES.auth.login}>Entrar</Link>
                </Button>

                <Button
                  size="sm"
                  variant="coloredOutline"
                  asChild
                  className="hidden sm:flex"
                >
                  <Link href={ROUTES.auth.signUp}>Registrar-se</Link>
                </Button>
              </>
            )}

            <ToggleThemeButton />
          </div>
        </div>
      </header>
    </>
  );
}
