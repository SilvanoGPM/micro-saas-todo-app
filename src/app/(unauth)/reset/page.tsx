import { Loader2Icon } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';

import { Verify } from './_components/verify';

export const metadata: Metadata = {
  title: 'Recuperar senha',
};

export default function ResetPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
      <Suspense
        fallback={
          <>
            <Loader2Icon className="size-8 animate-spin text-foreground" />

            <p>Verificando código de recuperação...</p>
          </>
        }
      >
        <Verify token={searchParams?.token} />
      </Suspense>
    </div>
  );
}
