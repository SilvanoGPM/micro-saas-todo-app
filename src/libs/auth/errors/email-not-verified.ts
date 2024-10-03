import { CredentialsSignin } from 'next-auth';

export class EmailNotVerifiedError extends CredentialsSignin {
  code = 'email_not_verified';

  constructor(message: string) {
    super(message);

    // Gambiarra para conseguir passar uma mensagem de erro
    this.code = message;
  }
}
