'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useRef, useTransition } from 'react';

import { Button } from '$components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '$components/ui/dialog';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { changeToFreeSubscriptionAction } from './actions';

export function CancelSubscriptionModal() {
  const closeRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const [isPending, startTranstion] = useTransition();

  function handleCancelSubscription() {
    startTranstion(async () => {
      try {
        await handleAction(changeToFreeSubscriptionAction);

        toast.success('Assinatura cancelada com sucesso!');

        router.refresh();

        closeRef.current?.click();
      } catch (error) {
        handleError(error, 'Não foi possível cancelar assinatura');
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Cancelar assinatura</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza?</DialogTitle>
          <DialogDescription>
            Ao cancelar sua assinatura, você somente poderá acessar certos
            recursos após assinar novamente.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex gap-4 justify-end">
            <DialogClose asChild>
              <Button ref={closeRef} variant="secondary">
                Cancelar
              </Button>
            </DialogClose>

            <Button
              isLoading={isPending}
              variant="destructive"
              onClick={handleCancelSubscription}
            >
              Confirmar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
