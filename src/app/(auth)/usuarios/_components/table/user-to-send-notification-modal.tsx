import {
  LinkIcon,
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

import { sendNotificationAction } from './actions';
import { sendNotificationSchema } from './schemas';
import { useUserIdFetcher } from './use-fetcher';

export interface UserToSendNotificationModalProps {
  userId: string;
  onClose: () => void;
}

export function UserToSendNotificationModal({
  userId,
  onClose,
}: UserToSendNotificationModalProps) {
  const userNotificationFetcher = useUserIdFetcher(userId);

  const form = useActionForm({
    action: sendNotificationAction,
    schema: sendNotificationSchema,

    fetcher: userNotificationFetcher,

    onSubmitSuccessful: () => {
      toast.success(`Notificação enviada com sucesso`);

      onClose();
    },

    defaultErrorMessage: `Não foi possível enviar notificação.`,
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
          <DialogTitle>Enviar notificação</DialogTitle>
          <DialogDescription>
            Enviar uma notificação privada para esse usuário?
          </DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form className="w-full flex flex-col gap-4">
              <InputForm
                required
                form={form}
                name="title"
                label="Título"
                labelIcon={TypeOutlineIcon}
                placeholder="ex: Olá tudo bem?"
              />

              <TextareaForm
                required
                form={form}
                name="body"
                label="Mensagem"
                labelIcon={MessageCircleIcon}
                placeholder="ex: Suas tarefas pendentes estão te esperando..."
              />

              <InputForm
                form={form}
                type="url"
                name="url"
                label="URL ao abrir"
                labelIcon={LinkIcon}
                placeholder="ex: https://example.com"
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="gap-2">
          <Button
            isLoading={form.formState.isSubmitting}
            onClick={form.submit}
            className="flex-1"
          >
            <SendIcon className="size-4 mr-2" /> Enviar
          </Button>

          <Button
            isLoading={form.formState.isSubmitting}
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
