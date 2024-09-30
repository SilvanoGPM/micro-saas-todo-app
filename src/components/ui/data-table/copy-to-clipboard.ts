import { toast } from 'sonner';

export interface CopyToClipboardParams {
  toCopy: string;
  label: string;
  rowId: string;
}

export function copyToClipboard({
  toCopy,
  label,
  rowId,
}: CopyToClipboardParams) {
  return () => {
    navigator.clipboard.writeText(toCopy);
    toast.success(`${label} copiado com sucesso`);

    try {
      document
        .querySelector(`[data-id="${rowId}"] [data-js="copy-default"]`)
        ?.classList.add('hidden');

      document
        .querySelector(`[data-id="${rowId}"] [data-js="copy-success"]`)
        ?.classList.remove('hidden');
    } catch {
      console.error('Não foi possível carregar seletores');
    }

    setTimeout(() => {
      document
        .querySelector(`[data-id="${rowId}"] [data-js="copy-default"]`)
        ?.classList.remove('hidden');

      document
        .querySelector(`[data-id="${rowId}"] [data-js="copy-success"]`)
        ?.classList.add('hidden');
    }, 3000);
  };
}
