import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_MODE: z.literal('test').optional(),
  },

  shared: {
    NEXT_PUBLIC_APP_URL: z
      .string()
      .optional()
      .transform((value) => {
        // Remove trailing slash
        return value?.endsWith('/') ? value.slice(0, -1) : value;
      }),

    NEXT_PUBLIC_USE_FAKES: z.string().optional(),

    NEXT_PUBLIC_NOTIFICATIONS_PUBLIC_KEY: z.string(),

    NODE_ENV: z.enum(['test', 'development', 'production']),
  },

  server: {
    EMAIL_USERNAME: z.string(),
    EMAIL_PASSWORD: z.string(),
    EMAIL_HOST: z.string(),
    EMAIL_PORT: z.coerce.number(),
    EMAIL_FROM: z.string(),

    STRIPE_PUBLISHABLE_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),

    SPACES_ENDPOINT: z.string(),
    SPACES_NAME: z.string(),
    SPACES_KEY: z.string(),
    SPACES_SECRET: z.string(),

    NOTIFICATIONS_PRIVATE_KEY: z.string(),

    CRON_KEY: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_MODE: process.env.NEXT_PUBLIC_MODE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_USE_FAKES: process.env.NEXT_PUBLIC_USE_FAKES,

    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_PORT: process.env.EMAIL_PORT,

    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    SPACES_ENDPOINT: process.env.SPACES_ENDPOINT,
    SPACES_NAME: process.env.SPACES_NAME,
    SPACES_KEY: process.env.SPACES_KEY,
    SPACES_SECRET: process.env.SPACES_SECRET,

    NEXT_PUBLIC_NOTIFICATIONS_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_NOTIFICATIONS_PUBLIC_KEY,

    NOTIFICATIONS_PRIVATE_KEY: process.env.NOTIFICATIONS_PRIVATE_KEY,

    CRON_KEY: process.env.CRON_KEY,
  },
});
