import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_MODE: z.literal('test').optional(),
  },

  shared: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),

    NEXT_PUBLIC_USE_FAKES: z.string().optional(),

    NODE_ENV: z.enum(['test', 'development', 'production']),
  },

  server: {
    EMAIL_USERNAME: z.string(),
    EMAIL_PASSWORD: z.string(),
    EMAIL_HOST: z.string(),
    EMAIL_PORT: z.coerce.number(),
    EMAIL_FROM: z.string(),
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
  },
});
