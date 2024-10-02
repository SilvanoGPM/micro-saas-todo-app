'use server';

import { CredentialsSignin } from 'next-auth';

import { EmailNotVerifiedError, signIn } from '$libs/auth';

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
    if (error instanceof EmailNotVerifiedError) {
      return { error: error.code, status: 'warning' };
    }

    if (error instanceof CredentialsSignin) {
      return { error: 'Credenciais incorretas', status: 'warning' };
    }

    return { error: 'Não foi possível realizar login' };
  }
}
