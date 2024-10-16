'use client';

import * as Sentry from '@sentry/nextjs';
import { AlertTriangleIcon, HomeIcon, Repeat2Icon } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Logo } from '$components/logo';
import { Button } from '$components/ui/button';
import { ROUTES } from '$libs/auth/routes';

export default function GlobalError({
  reset,
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6 text-center">
      <Logo className="text-4xl" />

      <div className="flex items-center gap-2">
        <h2 className="font-bold text-3xl">Erro 500</h2>
        <AlertTriangleIcon className="size-12" />
      </div>

      {error.message && (
        <p className="text-muted-foreground ">
          Ocorreu um erro inesperado. Por favor, tente novamente ou volte para a
          tela inicial.
          <>
            <br />
            Erro ocorrido: <span className="italic">{error.message}</span>
          </>
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button variant="outline" onClick={() => reset()}>
          Tentar novamente
          <Repeat2Icon className="size-4 ml-2" />
        </Button>

        <Button asChild variant="outline">
          <Link href={ROUTES.private.home.path}>
            Voltar para o início
            <HomeIcon className="size-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
