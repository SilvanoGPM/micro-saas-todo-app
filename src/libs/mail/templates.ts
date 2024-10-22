import { z } from 'zod';

export const templates = {
  contact: z.object({ title: z.string(), message: z.string() }),
};

export type TemplateName = keyof typeof templates;

export type TemplateData<T extends TemplateName> = z.infer<typeof templates[T]>;
