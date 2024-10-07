'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { BoxIcon, CalendarIcon, PlusCircleIcon, TextIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import { handleAction } from '$utils/handle-action';
import { handleError } from '$utils/handle-error';
import { InputDatePickerForm } from '$components/form/input-date-picker-form';

import { upsertTodoAction } from './actions';
import { upsertTodoSchema } from './schema';
import { useLoadForm } from './use-load-form';

export interface UpsertTodoSheetProps {
  todoId?: string | null;
  clearTodoId: () => void;
}

export function UpsertTodoSheet({ todoId, clearTodoId }: UpsertTodoSheetProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(upsertTodoSchema),
  });

  const handleUpsertTodo = form.handleSubmit(async (data) => {
    try {
      await handleAction(upsertTodoAction, data);

      await queryClient.invalidateQueries({
        queryKey: [HTTP_KEYS.todo.list],
      });

      form.reset();

      toast.success('Tarefa salva com sucesso!');

      buttonRef.current?.click();
    } catch (error) {
      handleError(error);
    }
  });

  useEffect(() => {
    if (todoId) {
      buttonRef.current?.click();
    }
  }, [todoId]);

  const loadForm = useLoadForm(form, todoId);

  return (
    <Sheet
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          clearTodoId();
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
            onSubmit={handleUpsertTodo}
            className="flex-1 space-y-8 mt-8 flex flex-col"
          >
            <InputForm
              required
              isLoading={loadForm.isLoading}
              form={form}
              name="title"
              placeholder="ex: Comprar comida"
              label="Título"
              labelIcon={TextIcon}
            />

            <TextareaForm
              form={form}
              isLoading={loadForm.isLoading}
              name="description"
              placeholder="ex: Comprar comida para a semana"
              label="Descrição"
              labelIcon={BoxIcon}
            />

            <InputDatePickerForm
              form={form}
              isLoading={loadForm.isLoading}
              name="completedAt"
              label="Data de conclusão"
              labelIcon={CalendarIcon}
              calendarProps={{
                disabled: { after: new Date() },
              }}
            />

            <Button
              isLoading={form.formState.isSubmitting || loadForm.isLoading}
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
