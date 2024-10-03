import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import NextAuth, { NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import github from 'next-auth/providers/github';
import google from 'next-auth/providers/google';

import { loginSchema } from '$app/(unauth)/login/_components/login-form/schema';

import { prisma } from '../prisma';

import { EmailNotFoundError } from './errors/email-not-found';
import { EmailNotVerifiedError } from './errors/email-not-verified';
import { ROUTES } from './routes';
import { IncorrectProviderError } from './errors/incorrect-provider';

export const sharedConfig = {
  providers: [
    credentials({
      id: 'credentials',

      async authorize(data) {
        const { email: dataEmail, password: dataPassword } = data;

        const validatedFields = loginSchema.safeParse({
          email: dataEmail,
          password: dataPassword,
        });

        if (validatedFields.error) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            _count: {
              select: {
                accounts: true,
              },
            },
          },
        });

        if (!user) {
          throw new EmailNotFoundError('E-mail não encontrado');
        }

        if (user._count.accounts > 0) {
          throw new IncorrectProviderError(
            'Sua conta não foi registrada com um e-mail. Tente outro método de login',
          );
        }

        if (!user.password) {
          return null;
        }

        if (!user.emailVerified) {
          throw new EmailNotVerifiedError('E-mail não verificado');
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        const { _count, ...userWithoutCount } = user;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return userWithoutCount as any;
      },
    }),

    github,
    google,
  ],
} as NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),

  pages: {
    signIn: ROUTES.auth.login,
    signOut: ROUTES.auth.login,
    error: ROUTES.auth.login,
    verifyRequest: ROUTES.auth.login,
    newUser: ROUTES.private.home.path,
  },

  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
  },

  ...sharedConfig,
});
