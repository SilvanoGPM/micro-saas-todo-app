import { redirect } from 'next/navigation';

import { ROUTES } from '$libs/auth';

import { flashMessageTypes, getFlashMessage } from './get-flash-message';

export function redirectToLogin(
  type: keyof typeof flashMessageTypes,
  message: string,
) {
  return redirect(`${ROUTES.auth.login}?${getFlashMessage(type, message)}`);
}
