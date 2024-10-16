'use client';

import * as Sentry from '@sentry/nextjs';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getSession } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode, useEffect } from 'react';

import { Toaster } from '$components/ui/sonner';
import { TooltipProvider } from '$components/ui/tooltip';
import { useFlashMessage } from '$hooks/use-flash-message';
import { queryClient } from '$libs/react-query';

export function Providers({ children }: { children: ReactNode }) {
  useFlashMessage();

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user) {
        Sentry.setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.name || '',
        });
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NextTopLoader color="hsl(var(--primary))" />

        <TooltipProvider>{children}</TooltipProvider>

        <Toaster
          closeButton
          pauseWhenPageIsHidden
          duration={3000}
          position="top-right"
          richColors
        />
      </ThemeProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
