import { useRouter } from 'next/navigation';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useEffect } from 'react';

import { httpClient } from '$libs/http-client';

export interface UsePoolingPatymentSuccessParams {
  enabled?: boolean;
  poolingName: string;
  email: string;

  poolingTimeout?: number;
  maxTries?: number;

  onSuccess?(): void;
}

let intervalId: NodeJS.Timeout | undefined;
let tries = 0;

export function usePoolingPatymentSuccess({
  enabled = true,
  email,
  poolingName,
  poolingTimeout = 100000,
  maxTries = 10,
  onSuccess,
}: UsePoolingPatymentSuccessParams) {
  const [pooling, setPooling] = useQueryState(poolingName, parseAsBoolean);

  const router = useRouter();

  useEffect(() => {
    async function verifyPayment() {
      if (tries >= maxTries && intervalId) {
        setPooling(null);
        clearInterval(intervalId);
        return;
      }

      try {
        console.log(`#${String(tries).padStart(2, '0')} Verifying payment...`);

        const response = await httpClient.get(
          `/payments/notes-verify?email=${email}`,
        );

        if (response.data.success) {
          if (intervalId) {
            clearInterval(intervalId);
          }

          setPooling(null);

          setTimeout(() => {
            window.location.reload();
          }, 100);

          onSuccess?.();
        }
      } catch {
        // Ignore
      } finally {
        tries++;
      }
    }

    if (!intervalId && pooling && enabled) {
      verifyPayment();

      intervalId = setInterval(verifyPayment, poolingTimeout);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }

      tries = 0;
    };
  }, [
    router,
    pooling,
    enabled,
    email,
    onSuccess,
    maxTries,
    setPooling,
    poolingTimeout,
  ]);
}
