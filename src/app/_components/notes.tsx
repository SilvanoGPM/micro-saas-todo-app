'use client';

import { ChevronRightIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import { ROUTES } from '$libs/auth/routes';
import { Button } from '$components/ui/button';

export function LandingPageNotes() {
  const { resolvedTheme } = useTheme();

  return (
    <section className="w-full max-w-6xl mx-auto flex-1 px-4 flex gap-8 lg:gap-0 flex-col-reverse lg:flex-row items-center text-center lg:text-start justify-center mt-16">
      <div className="flex-1 flex items-center justify-center">
        <img
          src={`/images/lp/${resolvedTheme}/notes-mobile-portrait.png`}
          className="max-w-[300px]"
        />
      </div>

      <div className="flex-1">
        <h3 className="uppercase text-[#9c40ff] text-lg tracking-widest font-semibold">
          Anotações
        </h3>

        <p className="text-balance tracking-tight text-3xl md:text-4xl font-bold">
          Organize corretamente informações.
        </p>

        <p className="text-muted-foreground mt-2 max-w-[500px] mx-auto lg:mx-0">
          Com nosso sistema de anotações, você pode escrever certas informações
          que considerar utéis para uma determinada tarefa.
        </p>

        <Button variant="coloredOutline" className="mt-4 rounded-full" asChild>
          <Link href={ROUTES.private.billing.path}>
            Saiba mais <ChevronRightIcon className="ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
