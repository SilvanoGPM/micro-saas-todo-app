'use client';

import { Loader2, SaveIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { toast } from 'sonner';

import { handleError } from '$utils/handle-error';
import { Button } from '$components/ui/button';
import { handleAction } from '$utils/handle-action';
import { useDebounce } from '$hooks/use-debounce';
import { useBeforeUnload } from '$hooks/use-before-unload';

import { saveChangesAction } from './actions';

import 'react-quill/dist/quill.snow.css';

export interface NotesEditorProps {
  id: string;
  defaultContent: string;
}

export function NotesEditor({ id, defaultContent }: NotesEditorProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSilentUpdating, setIsSilentUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [content, setContent] = useState(defaultContent);
  const quillRef = useRef<ReactQuill>(null);

  const preventDefaultContentChangeWhenSaving = useRef(false);

  const { debounce } = useDebounce(1500);

  useBeforeUnload(isSaving);

  async function handleSaveContent(silent = false) {
    if (isUpdating) {
      return;
    }

    try {
      setIsSilentUpdating(true);

      const delta = quillRef.current?.getEditor().getContents();
      const jsonDelta = JSON.stringify(delta || '');

      preventDefaultContentChangeWhenSaving.current = true;

      await handleAction(saveChangesAction, { id, content: jsonDelta });

      if (!silent) {
        toast.success('Conteúdo salvo com sucesso');
      }
    } catch (error) {
      if (!silent) {
        handleError(error, 'Erro ao salvar conteúdo');
      }
    } finally {
      setIsUpdating(false);
      setIsSilentUpdating(false);
    }
  }

  function handleContentChange(value: string) {
    setContent(value);
    setIsSaving(true);

    debounce(() => {
      setIsSaving(false);
      handleSaveContent(true);
    });
  }

  useEffect(() => {
    if (
      defaultContent &&
      quillRef.current &&
      !preventDefaultContentChangeWhenSaving.current
    ) {
      quillRef.current.getEditor().setContents(JSON.parse(defaultContent));
    }
  }, [defaultContent]);

  return (
    <div className="h-full relative flex flex-col gap-4">
      <Button
        isLoading={isUpdating}
        onClick={() => {
          setIsUpdating(true);
          handleSaveContent();
        }}
        className="w-fit self-end"
      >
        Salvar Alterações
        {isSilentUpdating && !isUpdating ? (
          <Loader2 className="size-3 ml-2 animate-spin" />
        ) : (
          <SaveIcon className="size-3 ml-2" />
        )}
      </Button>

      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={handleContentChange}
        className="h-full w-full max-h-[50vh]"
        preserveWhitespace={false}
        placeholder="Escreva suas anotações aqui..."
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
    </div>
  );
}
