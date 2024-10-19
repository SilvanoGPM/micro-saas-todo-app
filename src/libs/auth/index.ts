import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import { createStripeCustomerIfNotExists } from '$libs/stripe/customers';

import { prisma } from '../prisma';

import { applyTokenToSession } from './callbacks';
import { authProvidersConfig } from './config';
import { ROUTES } from './routes';

export const authOptions = NextAuth({
  ...authProvidersConfig,

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
    session({ token, session }) {
      if (token && session.user) {
        return applyTokenToSession(token, session);
      }

      return session;
    },

    async jwt({ token, trigger, session, user }) {
      if (trigger === 'update' && session) {
        token = { ...token, ...session.user };

        return token;
      }

      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user.id) {
          token.id = user.id;
        }

        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name || token.name,
        email: dbUser.email || token.email,
        image: dbUser.image || token.image,
        roles: dbUser.roles || token.roles,
        stripePriceId: dbUser.stripePriceId || token.stripePriceId,
        stripeNotesPaid: dbUser.stripeNotesPaid,
      };
    },
  },

  events: {
    createUser: async (message) => {
      await createStripeCustomerIfNotExists({
        email: message.user.email as string,
        name: message.user.name as string,
      });
    },
  },
});

export const { handlers, auth, signIn, signOut, unstable_update } = authOptions;
