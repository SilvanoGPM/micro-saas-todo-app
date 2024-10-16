import { HomeIcon, SearchXIcon } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '$components/logo';
import { Button } from '$components/ui/button';
import { ROUTES } from '$libs/auth/routes';
export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6 text-center">
      <Logo className="text-4xl" />

      <div className="flex items-center gap-2">
        <h2 className="font-bold text-3xl">Erro 404</h2>
        <SearchXIcon className="size-12" />
      </div>

      <p className="text-muted-foreground max-w-md">
        A página que você está procurando não foi encontrada. Por favor,
        verifique o endereço ou retorne à página inicial.
      </p>

      <Button asChild variant="outline">
        <Link href={ROUTES.private.home.path}>
          Voltar para o início
          <HomeIcon className="size-4 ml-2" />
        </Link>
      </Button>
    </div>
  );
}
