import { toast } from 'sonner';

import { ActionError } from '$libs/errors/action-error';

export const errorsToWarning = ['Unauthorized', 'Not Found'];

export function handleError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  defaultMessage = 'Tente novamente, em alguns minutos, caso o erro persista, entre em contato com o suporte.',
  methodOverride: 'error' | 'warning' = 'error',
) {
  let description =
    typeof error === 'string'
      ? error
      : error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        defaultMessage;

  console.error(error, description);

  const is422Error = error?.response?.status === 422;
  const is500Error = error?.response?.status === 500;

  const actionErrorStatus = error instanceof ActionError && error?.status;

  const method =
    methodOverride ||
    (errorsToWarning.includes(error?.response?.data?.error) ||
    is422Error ||
    actionErrorStatus === 'warning'
      ? 'warning'
      : 'error');

  if (is422Error) {
    description = 'Campos inválidos';
  }

  if (is500Error) {
    description = 'Problemas no servidor';
  }

  toast[method](`Aconteceu um ${method === 'error' ? 'erro' : 'problema'}`, {
    description,
  });
}
