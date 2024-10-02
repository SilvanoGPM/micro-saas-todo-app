'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { InputForm } from '$components/form/input-form';
import { Logo } from '$components/logo';
import { Button } from '$components/ui/button';
import { Form } from '$components/ui/form';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { forgotPasswordWithCredentials } from './actions';
import { ForgotPasswordSchema, forgotPasswordSchema } from './schema';

export interface ForgotPasswordFormProps {
  backToLogin: () => void;
}

export function ForgotPasswordForm({ backToLogin }: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleForgotPassword = form.handleSubmit(async (data) => {
    try {
      await handleAction(forgotPasswordWithCredentials, data);

      toast.success('Sucesso', {
        description: 'Um e-mail foi enviado para recuperar sua senha.',
      });

      backToLogin();
    } catch (error) {
      handleError(error, 'Não foi enviar e-mail, por favor tente novamente.');
    }
  });

  return (
    <div className="max-w-[400px] w-full flex flex-col gap-8">
      <div className="text-center">
        <Logo />

        <p className="text-muted-foreground">
          Informe seu e-mail para recuperar a senha
        </p>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <InputForm
              form={form}
              name="email"
              label="E-mail"
              labelIcon={MailIcon}
              placeholder="example@mail.com"
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={form.formState.isSubmitting}
            >
              Enviar e-mail
            </Button>

            <Button
              type="button"
              onClick={backToLogin}
              size="lg"
              variant="coloredOutline"
              className="w-full"
            >
              Voltar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
