'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { InputPasswordForm } from '$components/form/input-password-form';
import { Logo } from '$components/logo';
import { Button } from '$components/ui/button';
import { Form } from '$components/ui/form';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { changePassword } from './actions';
import { changePasswordSchema, ChangePasswordSchema } from './schema';

export interface ChangePasswordFormProps {
  token?: string;
}

export function ChangePasswordForm({ token }: ChangePasswordFormProps) {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleChangePassword = form.handleSubmit(async (data) => {
    try {
      await handleAction(changePassword, {
        token: token!,
        newPassword: data.password,
      });
    } catch (error) {
      handleError(error);
    }
  });

  return (
    <div className="max-w-[400px] w-full flex flex-col gap-8">
      <div className="text-center">
        <Logo />

        <p className="text-muted-foreground">Escolha sua nova senha</p>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={handleChangePassword} className="space-y-7">
            <div className="space-y-4">
              <InputPasswordForm
                form={form}
                name="password"
                label="Nova senha"
                placeholder="********"
              />

              <InputPasswordForm
                form={form}
                name="confirmPassword"
                label="Confirme sua nova senha"
                placeholder="********"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={form.formState.isSubmitting}
            >
              Alterar senha
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
