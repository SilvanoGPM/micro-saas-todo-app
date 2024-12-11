'use client';

import { Logo } from '$components/logo';

export function LandingPageFooter() {
  return (
    <footer className="h-28 w-full p-4 py-8 flex flex-col items-center justify-center gap-2 border-t">
      <Logo />

      <p>&copy; Copyright {new Date().getFullYear()}</p>
    </footer>
  );
}
