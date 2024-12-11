'use client';

import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '$components/ui/button';
import { ROUTES } from '$libs/auth/routes';

export function LandingPageHero() {
  function handleViewMore() {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  }

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[50vh] container z-10 flex flex-col items-center justify-center">
      <div className="flex flex-col items-start md:items-center gap-6 mb-6 text-left md:text-center">
        <Link
          href={ROUTES.private.billing.path}
          className="inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-foreground h-8 px-3 text-xs rounded-full"
        >
          🚀 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{' '}
          <span>Sistema de anotações</span>
          <ChevronRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </Link>

        <h2 className="text-balance text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          Mantenha a{' '}
          <span className="bg-gradient-to-r from-[#ffaa40] to-[#9c40ff] text-transparent bg-clip-text">
            organização
          </span>{' '}
          da sua vida.
        </h2>

        <p className="max-w-[64rem] text-balance text-sm tracking-tight text-muted-foreground md:text-xl">
          Salve seus deveres do dia a dia com facilidade com nosso sistema de
          controle de tarefas e anotações, com notificações e e-mails diários.
        </p>

        <div className="flex flex-col gap-4 justify-start md:justify-center w-full sm:w-auto sm:flex-row">
          <Button asChild>
            <Link href={ROUTES.private.home.path}>
              Começar agora
              <ChevronRightIcon className="ml-1 size-3" />
            </Link>
          </Button>

          <Button variant="coloredOutline" onClick={handleViewMore}>
            Ver mais
            <ChevronRightIcon className="ml-1 size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
