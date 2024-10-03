'use server';

import { CredentialsSignin } from 'next-auth';

import { signIn } from '$libs/auth';
import { EmailNotFoundError } from '$libs/auth/errors/email-not-found';
import { EmailNotVerifiedError } from '$libs/auth/errors/email-not-verified';
import { IncorrectProviderError } from '$libs/auth/errors/incorrect-provider';

import { loginSchema, LoginSchema } from './schema';

export async function loginWithCredentials(data: LoginSchema) {
  try {
    await loginSchema.parseAsync(data);
  } catch {
    return { error: 'Dados inválidos' };
  }

  try {
    await signIn('credentials', {
      ...data,
      redirect: false,
    });
  } catch (error) {
    if (
      error instanceof EmailNotVerifiedError ||
      error instanceof EmailNotFoundError ||
      error instanceof IncorrectProviderError
    ) {
      return { error: error.code, status: 'warning' };
    }

    if (error instanceof CredentialsSignin) {
      return { error: 'Credenciais incorretas', status: 'warning' };
    }

    return { error: 'Não foi possível realizar login' };
  }
}
