import { env } from '$env';
import { handleError } from '$utils/handle-error';

import { httpClient } from '../http-client';

async function registerSubscription(subscription: PushSubscription) {
  await httpClient.post('/notifications', { subscription });
}

async function handleServiceWorker() {
  const serviceWorker = await navigator.serviceWorker.register(
    '/notifications-sw.js',
  );

  await serviceWorker.update();

  let subscription = await serviceWorker.pushManager.getSubscription();

  try {
    if (!subscription) {
      await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: env.NEXT_PUBLIC_NOTIFICATIONS_PUBLIC_KEY,
      });

      subscription = await serviceWorker.pushManager.getSubscription();
    }

    if (!subscription) {
      return handleError('Tente novamente.');
    }

    await registerSubscription(subscription);
  } catch (error) {
    handleError(error, 'Não foi possível aceitar notificações');
  }
}

export function hasNotificationAPI() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  return 'Notification' in window;
}

export function verifyNotificationPermission(
  permission: NotificationPermission,
) {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const hasNotification = hasNotificationAPI();

  if (!hasNotification) {
    return false;
  }

  return permission === Notification.permission;
}

export async function requestNotificationsPermission() {
  if (!('Notification' in window)) {
    throw new Error('Seu navegador não suporta notificações, tente outro.');
  } else if (Notification.permission === 'granted') {
    await handleServiceWorker();
  } else {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      await handleServiceWorker();
    }
  }
}
