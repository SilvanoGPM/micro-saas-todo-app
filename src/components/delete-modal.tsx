import { useQueryClient } from '@tanstack/react-query';
import { Trash2Icon, XIcon } from 'lucide-react';
import { useMemo, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '$components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '$components/ui/dialog';
import { titleString } from '$utils/formatters';
import { handleError } from '$utils/handle-error';

export interface DeleteModalProps {
  context: string;
  description?: string;
  successMessage?: string;
  id?: string | null;
  setId: (id: string) => void;
  fn?: (id: string) => Promise<void>;
  queriesToInvalidate?: string[];
}

export function DeleteModal({
  context,
  description,
  successMessage,
  id,
  queriesToInvalidate = [],
  setId,
  fn,
}: DeleteModalProps) {
  const [contextTitle, contextLower] = useMemo(
    () => [titleString(context), context.toLowerCase()],
    [context],
  );

  const queryClient = useQueryClient();

  const [isDeleting, startTransition] = useTransition();

  function close() {
    if (!isDeleting) {
      setId('');
    }
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        if (id) {
          await fn?.(id);
        }

        for (const queryKey of queriesToInvalidate) {
          await queryClient.invalidateQueries({
            queryKey: [queryKey],
          });
        }

        toast.success(successMessage || `${contextTitle} deletado com sucesso`);

        close();
      } catch {
        handleError(`Não foi possível deletar ${contextLower}`);
      }
    });
  }

  return (
    <Dialog open={Boolean(id) || isDeleting} onOpenChange={close}>
      <DialogContent className="max-w-[300px] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deletar {contextLower}</DialogTitle>
          <DialogDescription>
            {description ||
              `Tem certeza que deseja deletar este ${contextLower}?`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            isLoading={isDeleting}
            variant="destructive"
            onClick={handleDelete}
            className="flex-1"
          >
            <Trash2Icon className="size-4 mr-2" /> Deletar
          </Button>

          <Button
            isLoading={isDeleting}
            onClick={close}
            variant="outline"
            className="flex-1"
          >
            <XIcon className="size-4 mr-2" /> Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
