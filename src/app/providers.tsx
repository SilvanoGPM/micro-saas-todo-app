'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode } from 'react';

import { Toaster } from '$components/ui/sonner';
import { TooltipProvider } from '$components/ui/tooltip';
import { useFlashMessage } from '$hooks/use-flash-message';
import { queryClient } from '$libs/react-query';

export function Providers({ children }: { children: ReactNode }) {
  useFlashMessage();

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
