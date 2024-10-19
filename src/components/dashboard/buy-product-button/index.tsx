'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, ButtonProps } from '$components/ui/button';
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';

import { buyProductAction } from './actions';

export interface BuyProductButtonProps extends ButtonProps {
  priceId: string;
  poolingName?: string;
  achor?: string;
}

export function BuyProductButton({
  priceId,
  poolingName,
  achor,
  ...props
}: BuyProductButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  async function handleBuyProduct() {
    setIsPending(true);

    try {
      const { data } = await handleAction(buyProductAction, {
        priceId,
        poolingName,
        achor,
      });

      if (data) {
        router.push(data.url);
      }
    } catch (error) {
      setIsPending(false);
      handleError(error, 'Erro ao gerar sessão de checkout');
    }
  }

  return <Button isLoading={isPending} {...props} onClick={handleBuyProduct} />;
}
