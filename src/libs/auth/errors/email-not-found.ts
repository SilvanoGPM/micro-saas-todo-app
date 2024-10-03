import { CredentialsSignin } from 'next-auth';

export class EmailNotFoundError extends CredentialsSignin {
  code = 'email_not_found';

  constructor(message: string) {
    super(message);

    // Gambiarra para conseguir passar uma mensagem de erro
    this.code = message;
  }
}
