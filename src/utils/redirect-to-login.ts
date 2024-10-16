import { redirect } from 'next/navigation';

import { ROUTES } from '$libs/auth/routes';

import { flashMessageTypes, getFlashMessage } from './flash-messages';

export function redirectToLogin(
  type: keyof typeof flashMessageTypes,
  message: string,
) {
  return redirect(getRedirectToLoginFlashMessage(type, message));
}

export function getRedirectToLoginFlashMessage(
  type: keyof typeof flashMessageTypes,
  message: string,
) {
  return `${ROUTES.auth.login}?${getFlashMessage(type, message)}`;
}
