'use client';

import { SaveIcon } from 'lucide-react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { InputForm } from '$components/form/input-form';
import { Button } from '$components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '$components/ui/card';
import { Form } from '$components/ui/form';
import { useActionForm } from '$hooks/use-action-form';

import { updateProfileAction } from './actions';
import { profileSchema } from './schema';

export interface ProfileFormProps {
  user?: Session['user'];
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const form = useActionForm({
    action: updateProfileAction,
    schema: profileSchema,

    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },

    onSubmitSuccessful() {
      toast.success('Perfil atualizado com sucesso!');
      router.refresh();
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.submit} className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Nome</CardTitle>
            <CardDescription>
              Este vai ser o nome público do seu usuário
            </CardDescription>
          </CardHeader>

          <CardContent>
            <InputForm
              required
              form={form}
              name="name"
              placeholder="ex: João Silva"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>E-mail</CardTitle>
            <CardDescription>
              No momento não é possível alterar o e-mail.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <InputForm
              required
              disabled
              form={form}
              name="email"
              placeholder="ex: joaosilva@mail.com"
            />
          </CardContent>
        </Card>

        <Button
          disabled={!form.formState.isDirty}
          isLoading={form.formState.isSubmitting}
          className="self-end w-fit"
        >
          <SaveIcon className="size-4 mr-2" />
          Salvar alterações
        </Button>
      </form>
    </Form>
  );
}
