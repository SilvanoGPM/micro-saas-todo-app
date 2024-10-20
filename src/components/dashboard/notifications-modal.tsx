'use client';

import { BellDotIcon, EyeOffIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '$components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '$components/ui/dialog';
import {
  requestNotificationsPermission,
  hasNotificationAPI,
  verifyNotificationPermission,
} from '$libs/notifications';
import { Repository } from '$libs/repository';
import { handleError } from '$utils/handle-error';

const PERMISSIONS_MODAL_KEY = 'todo-saas-notification-modal-key';

export function NotificationsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRequestPermission() {
    setIsLoading(true);

    try {
      await requestNotificationsPermission();

      setIsOpen(false);
    } catch (error) {
      handleError(error, 'Não foi possível ativar notificações');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDimissModal() {
    setIsOpen(false);
    Repository.save(PERMISSIONS_MODAL_KEY, { hideModal: true });
  }

  useEffect(() => {
    const notificationsStorage = Repository.get<{ hideModal?: boolean }>(
      PERMISSIONS_MODAL_KEY,
    );

    if (
      !verifyNotificationPermission('granted') &&
      !notificationsStorage?.hideModal
    ) {
      setIsOpen(true);
    }
  }, []);

  return (
    <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
      <DialogContent className="md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notificações</DialogTitle>
          <DialogDescription>
            Você pode ativar as notificações para receber informações diárias
            sobre suas tarefar.
          </DialogDescription>
        </DialogHeader>

        {!hasNotificationAPI() && (
          <div>
            <span>
              Navegador não compatível com notificações, caso você esteja
              utilizando um dispositivo iOS, siga o passo a passo para instalar
              o site na tela inicial.
            </span>

            <div className="mt-4">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/Zc_uapjKLlQ?si=vhylaXX4GuaW-J0n"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <DialogFooter>
          <div className="w-full flex flex-col gap-2">
            {hasNotificationAPI() ? (
              <Button
                onClick={handleRequestPermission}
                isLoading={isLoading}
                className="w-full flex-1"
              >
                <BellDotIcon className="size-4 mr-2" />
                Ativar notificações
              </Button>
            ) : (
              <Button
                onClick={() => setIsOpen(false)}
                isLoading={isLoading}
                className="w-full flex-1"
              >
                <XIcon className="size-4 mr-2" />
                Fechar
              </Button>
            )}

            <Button
              onClick={handleDimissModal}
              isLoading={isLoading}
              className="w-full flex-1"
              variant="outline"
            >
              <EyeOffIcon className="size-4 mr-2" />
              Não mostrar mais
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
