'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, ButtonProps } from '$components/ui/button';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { upgradePlanAction } from './actions';

export interface SubscribeButtonProps extends ButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId, ...props }: SubscribeButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  async function handleSubscribe() {
    setIsPending(true);

    try {
      const { data } = await handleAction(upgradePlanAction, {
        priceId,
      });

      if (data) {
        router.push(data.url);
      }
    } catch (error) {
      setIsPending(false);
      handleError(error, 'Erro ao gerar sessão de checkout');
    }
  }

  return <Button isLoading={isPending} {...props} onClick={handleSubscribe} />;
}
