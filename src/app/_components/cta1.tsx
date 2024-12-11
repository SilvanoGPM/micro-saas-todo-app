import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '$components/ui/button';
import { ROUTES } from '$libs/auth/routes';
import { STRIPE_PLANS } from '$libs/stripe/products';

export function LandingPageCTA1() {
  return (
    <>
      <section className="my-16 relative w-full bg-[#9c40ff99] bg-[url('/images/lp/cta1-bg.jpg')] bg-no-repeat bg-cover">
        <div className="relative min-h-[500px] px-4 flex flex-col gap-4 items-center justify-center text-center h-full w-full bg-white/10 backdrop-blur-sm dark:bg-black/10">
          <div className="flex items-center justify-center size-24 rounded-[2rem] bg-white/10 p-3 shadow-2xl backdrop-blur-md dark:bg-black/10 lg:size-32">
            <img src="/images/lp/cta1-icon.webp" />
          </div>

          <h2 className="font-bold text-4xl">Experimente já a plataforma</h2>

          <p>
            Você começa com {STRIPE_PLANS.free.quota.tasks} tarefas e pode
            atualizar seu plano para desbloquear mais!
          </p>

          <Button variant="outline" className="rounded-full" asChild>
            <Link href={ROUTES.private.home.path}>
              Começar gratuitamente
              <ChevronRightIcon className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
