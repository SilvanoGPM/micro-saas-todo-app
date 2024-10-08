export class ActionError extends Error {
  status: string;

  constructor(error: unknown, status: string) {
    let message = 'Erro desconhecido';

    if (typeof error === 'string') {
      message = error;
    } else if (
      typeof error === 'object' &&
      error &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      message = error.message;
    }

    super(message);
    this.status = status;
    this.name = 'ActionError';
  }
}
