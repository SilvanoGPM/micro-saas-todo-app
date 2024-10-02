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
