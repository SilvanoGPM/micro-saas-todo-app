/// <reference lib="webworker" />

declare const clients: Clients;

interface INotificationPayload {
  icon: string;
  title: string;
  body: string;
  imageUrl?: string;
  data?: object;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sw = self as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
sw.addEventListener('push', (event: any) => {
  const notificationPayload = event.data?.json() as INotificationPayload;

  event.waitUntil(
    sw.registration.showNotification(notificationPayload.title, {
      icon: notificationPayload.icon,
      body: notificationPayload.body,
      image: notificationPayload.imageUrl,
      data: notificationPayload.data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any),
  );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
sw.addEventListener('notificationclick', function (event: any) {
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  if (!urlToOpen) {
    return;
  }

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
