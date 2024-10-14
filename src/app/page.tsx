import Link from 'next/link';

import { ROUTES } from '$libs/auth/routes';
import { Button } from '$components/ui/button';
import { Logo } from '$components/logo';

export default function HomePage() {
  return (
    <main className="h-dvh w-full flex flex-col gap-4 items-center justify-center">
      <Logo />

      <Button>
        <Link href={ROUTES.private.home.path}>Ir para Dashboard</Link>
      </Button>
    </main>
  );
}
