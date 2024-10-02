import { Loader2Icon } from 'lucide-react';
import { Metadata } from 'next';

import { Verify } from './_components/verify/verify';

export const metadata: Metadata = {
  title: 'Verificação de e-mail',
};

export default function VerifyPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
      <Loader2Icon className="size-8 animate-spin text-foreground" />

      <p>Realizando validação do e-mail...</p>

      <Verify token={searchParams?.token} />
    </div>
  );
}
