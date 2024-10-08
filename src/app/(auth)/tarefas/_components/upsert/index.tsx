'use client';

import { BoxIcon, CalendarIcon, PlusCircleIcon, TextIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { InputDatePickerForm } from '$components/form/input-date-picker-form';
import { InputForm } from '$components/form/input-form';
import { TextareaForm } from '$components/form/texteara-form';
import { Button } from '$components/ui/button';
import { Form } from '$components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '$components/ui/sheet';
import { HTTP_KEYS } from '$config';
import { useActionForm } from '$hooks/use-action-form';

import { upsertTodoAction } from './actions';
import { defaultUpsertTodoValues, upsertTodoSchema } from './schema';
import { useTodoFetcher } from './use-fetcher';

export interface UpsertTodoSheetProps {
  todoId?: string | null;
  clearTodoId: () => void;
}

export function UpsertTodoSheet({ todoId, clearTodoId }: UpsertTodoSheetProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const todoFetcher = useTodoFetcher(todoId);

  const form = useActionForm({
    defaultValues: defaultUpsertTodoValues,
    action: upsertTodoAction,
    schema: upsertTodoSchema,
    queriesToInvalidate: [HTTP_KEYS.todo.list],

    fetcher: todoFetcher,

    onSubmitSuccessful() {
      form.reset();

      toast.success('Tarefa salva com sucesso!');

      buttonRef.current?.click();
    },
  });

  useEffect(() => {
    if (todoId) {
      buttonRef.current?.click();
    }
  }, [todoId]);

  return (
    <Sheet
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          clearTodoId();
          form.reset(defaultUpsertTodoValues);
        }
      }}
    >
      <SheetTrigger asChild>
        <Button className="flex-1" size="sm" ref={buttonRef}>
          <PlusCircleIcon className="size-4 mr-2" />
          Adicionar tarefa
        </Button>
      </SheetTrigger>

      <SheetContent className="h-screen flex flex-col">
        <SheetHeader>
          <SheetTitle>Adicionar tarefa</SheetTitle>
          <SheetDescription>
            Adicione uma nova tarefa para ser realizada.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.submit}
            className="flex-1 space-y-8 mt-8 flex flex-col"
          >
            <InputForm
              required
              isLoading={form.isFetching}
              form={form}
              name="title"
              placeholder="ex: Comprar comida"
              label="Título"
              labelIcon={TextIcon}
            />

            <TextareaForm
              form={form}
              isLoading={form.isFetching}
              name="description"
              placeholder="ex: Comprar comida para a semana"
              label="Descrição"
              labelIcon={BoxIcon}
            />

            <InputDatePickerForm
              form={form}
              isLoading={form.isFetching}
              name="completedAt"
              label="Data de conclusão"
              labelIcon={CalendarIcon}
              calendarProps={{
                disabled: { after: new Date() },
              }}
            />

            <Button
              isLoading={form.formState.isSubmitting || form.isFetching}
              className="w-full !mt-auto"
            >
              Salvar tarefa
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
