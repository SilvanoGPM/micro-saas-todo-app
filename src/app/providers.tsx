'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode } from 'react';

import { Toaster } from '$components/ui/sonner';
import { TooltipProvider } from '$components/ui/tooltip';
import { queryClient } from '$libs/react-query';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        // TODO: Remover caso o projeto vá ter o modo escuro.
        forcedTheme="light"
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NextTopLoader color="hsl(var(--primary))" />

        <TooltipProvider>{children}</TooltipProvider>

        <Toaster
          // TODO: Remover caso o projeto vá ter o modo escuro.
          theme="light"
          closeButton
          pauseWhenPageIsHidden
          duration={3000}
          position="bottom-right"
          richColors
        />
      </ThemeProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
