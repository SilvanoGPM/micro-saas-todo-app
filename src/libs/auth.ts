export const ROUTES = {
  auth: {
    login: '/login',
    verify: '/verify',
    reset: '/reset',
  },

  private: {
    home: {
      path: '/',
    },
  },
};

import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import NextAuth, { CredentialsSignin, NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';

import { loginSchema } from '$app/(unauth)/login/_components/login-form/schema';

import { prisma } from './prisma';

export class EmailNotVerifiedError extends CredentialsSignin {
  code = 'email_not_verified';

  constructor(message: string) {
    super(message);
    this.code = message;
  }
}

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
        });

        if (!user || !user.password) {
          return null;
        }

        if (!user.emailVerified) {
          throw new EmailNotVerifiedError('E-mail não verificado');
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return user as any;
      },
    }),
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
