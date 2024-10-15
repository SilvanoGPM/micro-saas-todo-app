'use client';

import Image from 'next/image';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect } from 'react';

import { ToggleThemeButton } from '$components/toggle-theme';
import { handleError } from '$utils/handle-error';

import { ForgotPasswordForm } from './_components/forget-password-form';
import { LoginForm } from './_components/login-form';
import { RegisterForm } from './_components/register-form';

let errorShowed = false;

export default function LoginPage() {
  const [tab, setTab] = useQueryState('tab', parseAsString);
  const [error, setError] = useQueryState('error', parseAsString);

  useEffect(() => {
    if (error && !errorShowed) {
      errorShowed = true;
      setError(null);

      // Timeout para executar o toast.
      setTimeout(() => {
        handleError(error);
      }, 100);
    }
  }, [error, setError]);

  return (
    <div className="w-full h-full flex-1 flex">
      <div className="absolute top-2 right-2 z-10">
        <ToggleThemeButton />
      </div>

      <div className="flex-1 flex flex-col gap-4 items-center justify-center p-4 md:px-8 md:overflow-auto">
        {!tab && (
          <LoginForm
            goToRegister={() => setTab('register')}
            goToForgetPassword={() => setTab('password')}
          />
        )}

        {tab === 'register' && (
          <RegisterForm backToLogin={() => setTab(null)} />
        )}

        {tab === 'password' && (
          <ForgotPasswordForm backToLogin={() => setTab(null)} />
        )}
      </div>

      <div className="w-[65%] relative hidden lg:block">
        <Image
          src="/images/login/bg.jpg"
          alt="Homem com várias tarefas"
          className="absolute inset-0 object-cover w-full h-full"
          width={5671}
          height={3781}
        />
      </div>
    </div>
  );
}
