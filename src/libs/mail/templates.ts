import { z } from 'zod';

import { env } from '$env';
import { ROUTES } from '$libs/auth/routes';
import { getFirstString } from '$utils/strings';

export const templates = {
  contact: {
    validation: z.object({
      name: z.string().transform((value) => getFirstString(value)),
      title: z.string(),
      message: z.string(),
    }),

    defaultValues: {
      action_url: `${env.NEXT_PUBLIC_APP_URL}${ROUTES.private.home.path}`,
    },
  },

  'reset-password': {
    validation: z.object({
      name: z.string().transform((value) => getFirstString(value)),
      action_url: z.string(),
    }),

    defaultValues: {},
  },

  welcome: {
    validation: z.object({
      name: z.string().transform((value) => getFirstString(value)),
      action_url: z.string(),
    }),

    defaultValues: {},
  },

  'daily-notification': {
    validation: z.object({
      name: z.string().transform((value) => getFirstString(value)),
      todos_count: z.number(),
    }),

    defaultValues: {
      action_url: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.private.home.path}}`,
    },
  },

  'notes-unlocked': {
    validation: z.object({
      name: z.string().transform((value) => getFirstString(value)),
    }),

    defaultValues: {
      action_url: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.private.home.path}}`,
    },
  },
} as const;

export type TemplateName = keyof typeof templates;

export type TemplateData<T extends TemplateName> = z.infer<
  typeof templates[T]['validation']
>;
