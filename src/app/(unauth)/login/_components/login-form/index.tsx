'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';

import { InputForm } from '$components/form/input-form';
import { InputPasswordForm } from '$components/form/input-password-form';
import { GithubIcon } from '$components/icons/github';
import { GoogleIcon } from '$components/icons/google';
import { Logo } from '$components/logo';
import { Button } from '$components/ui/button';
import { Form } from '$components/ui/form';
import { Separator } from '$components/ui/separator';
import { ROUTES } from '$libs/auth';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { loginWithCredentials } from './actions';
import { LoginSchema, loginSchema } from './schema';

export interface LoginFormProps {
  goToForgetPassword: () => void;
  goToRegister: () => void;
}

export function LoginForm({
  goToForgetPassword,
  goToRegister,
}: LoginFormProps) {
  const router = useRouter();

  const [isCredentialsAuthLoading, setIsCredentialsAuthLoading] =
    useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleCredentialsLogin = form.handleSubmit(async (data) => {
    try {
      setIsCredentialsAuthLoading(true);

      await handleAction(loginWithCredentials, data);

      router.push(ROUTES.private.home.path);

      toast.success('Sucesso', {
        description: 'Login realizado com sucesso',
      });
    } catch (error) {
      handleError(error);
      setIsCredentialsAuthLoading(false);
    }
  });

  const isLoading = form.formState.isSubmitting || isCredentialsAuthLoading;

  return (
    <div className="max-w-[400px] w-full flex flex-col gap-8">
      <div className="text-center">
        <Logo />
        <p className="text-muted-foreground">Insira seus dados para entrar</p>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={handleCredentialsLogin} className="space-y-7">
            <div className="space-y-4">
              <InputForm
                form={form}
                name="email"
                label="E-mail"
                labelIcon={MailIcon}
                placeholder="example@mail.coms"
              />

              <div>
                <InputPasswordForm
                  form={form}
                  name="password"
                  label="Senha"
                  placeholder="********"
                />

                <Button
                  onClick={goToForgetPassword}
                  type="button"
                  variant="link"
                  className="w-full justify-end p-0 mt-2"
                >
                  Esqueceu sua senha?
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>
        </Form>

        <Button
          onClick={goToRegister}
          variant="link"
          className="w-full justify-end p-0"
        >
          Não possui uma conta?
        </Button>

        <div className="flex flex-col w-full items-center">
          <div className="my-8 flex gap-2 items-center w-full">
            <Separator className="flex-1" />
            <p>
              <span className="font-bold text-primary">Entrar</span> com outros
            </p>
            <Separator className="flex-1" />
          </div>

          <Button
            className="w-full mb-4"
            variant="outline"
            isLoading={isLoading}
          >
            <GoogleIcon className="size-4 mr-2" />
            Entrar com Google
          </Button>

          <Button className="w-full " variant="outline" isLoading={isLoading}>
            <GithubIcon className="size-4 mr-2" />
            Entrar com Github
          </Button>
        </div>
      </div>
    </div>
  );
}
