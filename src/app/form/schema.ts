import { z } from 'zod';

import {
  cnpjSchema,
  comboboxOptionSchema,
  confirmPassword,
  cpfSchema,
  createAcceptFieldSchema,
  createFileSchema,
  dateSchema,
  fieldIsRequiredValidation,
  phoneSchema,
} from '$utils/zod';

export const documentsOptions = [
  { label: 'Registro Geral (RG)', value: 'rg' },
  { label: 'CPF', value: 'cpf' },
  { label: 'CNPJ', value: 'cnpj' },
  { label: 'CNH', value: 'cnh' },
  { label: 'Certidão de nascimento', value: 'certidao-nasicmento' },
];

export const filesOptions = {
  maxSize: 3 * 1024 * 1024,
  maxFileCount: 3,
};

export const persistFormSchema = z
  .object({
    name: z.string(fieldIsRequiredValidation).min(1, 'Nome é obrigatório'),

    cpf: cpfSchema,
    cnpj: cnpjSchema,

    phone: phoneSchema,

    date: dateSchema,

    money: z.coerce.number(fieldIsRequiredValidation),
    quantity: z.coerce.number(fieldIsRequiredValidation),

    docs: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: 'Selecione pelo menos um documento',
    }),

    allowNotifications: createAcceptFieldSchema(
      'Você deve ativar as notificações',
    ),

    acceptTerms: createAcceptFieldSchema('Você deve aceitar os termos'),

    notificationsType: z.enum(['all', 'mentions', 'important'], {
      required_error: 'Você deve selecionar um tipo de notificação',
    }),

    email: z
      .string(fieldIsRequiredValidation)
      .email('O e-mail deve ser válido')
      .min(1, 'Nome é obrigatório'),

    opinion: z.string(fieldIsRequiredValidation).optional(),

    password: z
      .string(fieldIsRequiredValidation)
      .min(1, 'A senha é obrigatória'),

    confirmPassword: z
      .string(fieldIsRequiredValidation)
      .min(1, 'Confirme a senha'),

    users: z
      .array(comboboxOptionSchema, fieldIsRequiredValidation)
      .min(2, 'Escolha pelo menos dois usuários'),

    tags: z
      .array(comboboxOptionSchema, fieldIsRequiredValidation)
      .min(1, 'Escolha pelo menos uma tag'),

    files: z
      .array(createFileSchema(filesOptions.maxSize), fieldIsRequiredValidation)
      .min(1, 'Envie pelo menos um arquivo')
      .max(
        filesOptions.maxFileCount,
        `O máximo é ${filesOptions.maxFileCount} arquivos`,
      ),

    file: z
      .array(createFileSchema(filesOptions.maxSize), fieldIsRequiredValidation)
      .min(1, 'Envie um arquivo'),
  })
  .superRefine(
    confirmPassword({
      passwordPath: 'password',
      confirmPath: 'confirmPassword',
    }),
  );

export type PersistFormSchema = z.infer<typeof persistFormSchema>;

export const persitFormDefaultValues: Partial<PersistFormSchema> = {
  name: '',
  email: '',
  password: '',
  phone: '',
  cpf: '',
  cnpj: '',
  date: '',
  confirmPassword: '',
  opinion: undefined,
  users: [],
  tags: [],
  files: [],
  money: 0,
  quantity: 0,
  allowNotifications: false,
  notificationsType: 'all',
  acceptTerms: false,
  docs: ['rg'],
};
