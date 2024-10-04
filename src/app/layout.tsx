import { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';

import { defaultFont } from '$styles/font';
import '$styles/globals.css';
import { cn } from '$utils/cn';

import { Providers } from './providers';

const EnableMSW = dynamic(
  () => import('$app/api/mocks/mws').then((mod) => mod.EnableMSW),
  { ssr: false },
);

export const viewport: Viewport = {
  themeColor: '#FFFFFFF',
};

export const metadata: Metadata = {
  title: {
    template: '%s | TodoSaaS',
    default: 'TodoSaaS',
  },

  description: 'Salve suas tarefas do dia a dia com facilidade!',

  manifest: '/manifest.json',

  icons: [
    { rel: 'shortcut icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          defaultFont.variable,
        )}
      >
        <EnableMSW />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
