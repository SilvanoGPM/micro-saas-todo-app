import { redirect } from 'next/navigation';

export const flashMessageTypes = {
  warning: 'flash-warning',
  error: 'flash-error',
  info: 'flash-info',
  success: 'flash-success',
} as const;

export function getFlashMessage(
  type: keyof typeof flashMessageTypes,
  message: string,
) {
  return `${flashMessageTypes[type]}=${encodeURIComponent(message)}`;
}

export interface RedirectWithFlashMessageParams {
  type?: keyof typeof flashMessageTypes;
  message: string;
  path: string;
}

export function redirectWithFlashMessage({
  type = 'warning',
  message,
  path,
}: RedirectWithFlashMessageParams) {
  return redirect(`${path}?${getFlashMessage(type, message)}`);
}
