import {
  MessageCircleIcon,
  SendIcon,
  TypeOutlineIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { InputForm } from '$components/form/input-form';
import { TextareaForm } from '$components/form/texteara-form';
import { Button } from '$components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '$components/ui/dialog';
import { Form } from '$components/ui/form';
import { useActionForm } from '$hooks/use-action-form';

import { sendMailAction } from './actions';
import { sendMailSchema } from './schemas';
import { useUserEmailFetcher } from './use-fetcher';

export interface UserToSendMailModalProps {
  userId: string;
  onClose: () => void;
}

export function UserToSendMailModal({
  userId,
  onClose,
}: UserToSendMailModalProps) {
  const userEmailFetcher = useUserEmailFetcher(userId);

  const form = useActionForm({
    action: sendMailAction,
    schema: sendMailSchema,

    fetcher: userEmailFetcher,

    onSubmitSuccessful: () => {
      toast.success(`E-mail enviado com sucesso`);

      // onClose();
    },

    defaultErrorMessage: `Não foi possível enviar e-mail.`,
  });

  function close() {
    if (!form.formState.isSubmitting) {
      onClose();
    }
  }

  return (
    <Dialog
      open={Boolean(userId) || form.formState.isSubmitting}
      onOpenChange={close}
    >
      <DialogContent className="max-w-[300px] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar e-mail</DialogTitle>
          <DialogDescription>
            Envie um e-mail privado para esse usuário.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form className="w-full flex flex-col gap-4">
              <InputForm
                form={form}
                name="title"
                label="Título"
                labelIcon={TypeOutlineIcon}
                placeholder="ex: Olá tudo bem?"
                isLoading={form.isFetching}
              />

              <TextareaForm
                form={form}
                name="message"
                label="Mensagem"
                labelIcon={MessageCircleIcon}
                placeholder="ex: Suas tarefas pendentes estão te esperando..."
                isLoading={form.isFetching}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="gap-2">
          <Button
            isLoading={form.formState.isSubmitting || form.isFetching}
            onClick={form.submit}
            className="flex-1"
          >
            <SendIcon className="size-4 mr-2" /> Enviar
          </Button>

          <Button
            isLoading={form.formState.isSubmitting || form.isFetching}
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
