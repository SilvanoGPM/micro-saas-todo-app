import { toast } from 'sonner';

import { ActionError } from '$libs/errors/action-error';

export const errorsToWarning = ['Unauthorized', 'Not Found'];

export const descriptionsMap = {
  OAuthAccountNotLinked: 'E-mail já foi utilizado em outro método de login',
};

export function handleError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  defaultMessage = 'Tente novamente, em alguns minutos, caso o erro persista, entre em contato com o suporte.',
  methodOverride?: 'error' | 'warning',
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

  let method =
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

  const descriptionMap =
    descriptionsMap[description as keyof typeof descriptionsMap];

  if (descriptionMap) {
    description = descriptionMap;
    method = 'warning';
  }

  if (description === 'Erro desconhecido') {
    description = defaultMessage;
  }

  toast[method](`Aconteceu um ${method === 'error' ? 'erro' : 'problema'}`, {
    description,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorToJson(error: Error): Record<string, any> {
  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
  };
}
