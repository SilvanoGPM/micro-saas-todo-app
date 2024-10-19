'use client';

import { LockKeyholeIcon } from 'lucide-react';
import { Session } from 'next-auth';
import dynamic from 'next/dynamic';

import { BuyProductButton } from '$components/dashboard/buy-product-button';
import { OpaqueBadge } from '$components/opaque-badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '$components/ui/card';
import { POOLING_NAMES } from '$config';
import { STRIPE_PRODUCTS } from '$libs/stripe/products';
import { formatPrice } from '$utils/formatters';

import 'react-quill/dist/quill.snow.css';
import { usePoolingPatymentSuccess } from './use-pooling-payment-success';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

export interface NotesProps {
  user: Session['user'];
}

export function Notes({ user }: NotesProps) {
  usePoolingPatymentSuccess({
    poolingName: POOLING_NAMES.notes,
    email: user.email,
  });

  return (
    <Card id="notes" className="-scroll-mt-32">
      <CardHeader>
        <CardTitle>Anotações</CardTitle>
        <CardDescription>
          Desbloqueie o poder de registrar anotações para suas tarefas. <br />{' '}
          Faça um teste:
        </CardDescription>
      </CardHeader>

      <CardContent className="mb-16 lg:mb-12">
        <ReactQuill
          className="w-full h-[150px] text-foreground"
          preserveWhitespace={false}
          placeholder="Faça um teste das anotações..."
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline', 'strike', 'link'],
              [
                'blockquote',
                'code-block',
                { script: 'sub' },
                { script: 'super' },
              ],

              [
                { align: [] },
                { font: [] },
                { size: ['small', 'normal', 'large', 'huge'] },
                { header: [1, 2, 3, 4, 5, 6] },
              ],

              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],

              [{ color: [] }, { background: [] }],

              ['clean'],
            ],
          }}
        />
      </CardContent>

      <CardFooter className="flex-col sm:flex-row text-center gap-2 justify-between items-center pt-6">
        {user.stripeNotesPaid ? (
          <>
            <p className="text-sm">Status das anotações:</p>

            <OpaqueBadge className="w-fit px-4" color="#28a745">
              Desbloqueadas
            </OpaqueBadge>
          </>
        ) : (
          <>
            <p className="text-sm">Desbloquear anotações por apenas:</p>

            <BuyProductButton
              priceId={STRIPE_PRODUCTS.notes.priceId}
              poolingName={POOLING_NAMES.notes}
              achor="notes"
            >
              <LockKeyholeIcon className="size-4 mr-2" />
              {formatPrice(STRIPE_PRODUCTS.notes.price)} / para sempre
            </BuyProductButton>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
