import { env } from '$env';

import { handlers } from './handlers';

export async function enableMSW() {
  if (env.NEXT_PUBLIC_MODE !== 'test') {
    return;
  }

  if (typeof window !== 'undefined') {
    const { setupWorker } = await import('msw/browser');

    const worker = setupWorker(...handlers);

    await worker.start({
      onUnhandledRequest(req, print) {
        // specify routes to exclude
        const excludedRoutes = [
          '/favicon.ico',
          '/manifest.json',
          '/logo192.png',
          'chrome-extension',
        ];

        const isExcluded = excludedRoutes.some((route) =>
          req.url.includes(route),
        );

        if (isExcluded) {
          return;
        }

        print.warning();
      },
    });
  } else {
    const { setupServer } = await import('msw/node');

    const server = setupServer(...handlers);

    server.listen();
  }
}
