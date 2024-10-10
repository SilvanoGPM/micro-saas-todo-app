'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, ButtonProps } from '$components/ui/button';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { generateCheckoutSessionAction } from './actions';

export function SubscribeButton(props: ButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  async function handleSubscribe() {
    setIsPending(true);

    try {
      const { data } = await handleAction(generateCheckoutSessionAction);

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
