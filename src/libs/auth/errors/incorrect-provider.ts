import { CredentialsSignin } from 'next-auth';

export class IncorrectProviderError extends CredentialsSignin {
  code = 'incorrect_provider';

  constructor(message: string) {
    super(message);

    // Gambiarra para conseguir passar uma mensagem de erro
    this.code = message;
  }
}
