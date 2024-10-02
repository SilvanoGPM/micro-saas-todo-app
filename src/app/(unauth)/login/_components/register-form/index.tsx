'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { InputForm } from '$components/form/input-form';
import { InputPasswordForm } from '$components/form/input-password-form';
import { Logo } from '$components/logo';
import { Button } from '$components/ui/button';
import { Form } from '$components/ui/form';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { registerWithCredentials } from './actions';
import { RegisterSchema, registerSchema } from './schema';

export interface RegisterFormProps {
  backToLogin: () => void;
}

export function RegisterForm({ backToLogin }: RegisterFormProps) {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRegister = form.handleSubmit(async (data) => {
    try {
      await handleAction(registerWithCredentials, data);

      toast.success('Sucesso', {
        description: 'Um e-mail foi enviado para você verificar sua conta.',
      });

      backToLogin();
    } catch (error) {
      handleError(error);
    }
  });

  return (
    <div className="max-w-[400px] w-full flex flex-col gap-8">
      <div className="text-center">
        <Logo />

        <p className="text-muted-foreground">
          Crie sua conta informando seus dados
        </p>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={handleRegister} className="space-y-7">
            <div className="space-y-4">
              <InputForm
                form={form}
                name="name"
                label="Nome"
                labelIcon={MailIcon}
                placeholder="João da Silva"
              />

              <InputForm
                form={form}
                name="email"
                label="E-mail"
                labelIcon={MailIcon}
                placeholder="example@mail.coms"
              />

              <InputPasswordForm
                form={form}
                name="password"
                label="Senha"
                placeholder="********"
              />

              <InputPasswordForm
                form={form}
                name="confirmPassword"
                label="Confirme sua senha"
                placeholder="********"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={form.formState.isSubmitting}
            >
              Criar conta
            </Button>
          </form>
        </Form>

        <Button
          onClick={backToLogin}
          variant="link"
          className="w-full justify-end p-0"
        >
          Já possui uma conta?
        </Button>
      </div>
    </div>
  );
}
