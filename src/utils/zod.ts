import { z } from 'zod';

import { formatToISOString } from './formatters';
import { isValidCNPJ } from './is-valid-cnpj';
import { isValidCPF } from './is-valid-cpf';
import { getFileMB } from './file';

export interface ConfirmPasswordParams<S> {
  /** Caminho no schema para a senha */
  passwordPath: keyof S;

  /** Caminho no schema para a confirmação da senha */
  confirmPath: keyof S;

  /** Mensagem para caso as senhas não sejam iguais */
  message?: string;
}

/** Válida se a senha e a confirmação das senha são iguais */
export function confirmPassword<S>({
  passwordPath,
  confirmPath,
  message = 'As senhas não são iguais',
}: ConfirmPasswordParams<S>) {
  return (params: S, ctx: z.RefinementCtx) => {
    const password = params[passwordPath];
    const confirmPassword = params[confirmPath];

    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message,
        path: [confirmPath as string],
      });
    }
  };
}

export const fieldIsRequiredValidation = {
  invalid_type_error: 'Tipo inválido',
  required_error: 'Campo obrigatório',
};

export const dateSchema = z.coerce
  .date({
    errorMap: () => ({ message: 'Data inválida' }),
  })
  .transform(formatToISOString);

export const comboboxOptionSchema = z.object(
  {
    label: z.string(),
    value: z.string(),
  },
  fieldIsRequiredValidation,
);

export const cpfSchema = z
  .string(fieldIsRequiredValidation)
  .superRefine((cpf, ctx) => {
    if (!isValidCPF(cpf)) {
      ctx.addIssue({
        code: 'custom',
        message: 'CPF inválido',
      });
    }
  });

export const cnpjSchema = z
  .string(fieldIsRequiredValidation)
  .superRefine((cnpj, ctx) => {
    if (!isValidCNPJ(cnpj)) {
      ctx.addIssue({
        code: 'custom',
        message: 'CNPJ inválido',
      });
    }
  });

export const phoneSchema = z
  .string(fieldIsRequiredValidation)
  .min(10, 'Insira um telefone válido');

export const createFileSchema = (maxSize: number) =>
  z.instanceof(File).refine((file) => file.size < maxSize, {
    message: `O arquivo deve ser menor que ${getFileMB(maxSize)} MB`,
  });

export const createAcceptFieldSchema = (message: string) =>
  z.coerce.boolean(fieldIsRequiredValidation).superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({
        code: 'custom',
        message,
      });
    }
  });
