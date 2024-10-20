'use client';

import { CameraIcon, SaveIcon } from 'lucide-react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { FileUploaderForm } from '$components/form/file-uploader-form';
import { InputForm } from '$components/form/input-form';
import { Avatar, AvatarFallback, AvatarImage } from '$components/ui/avatar';
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
import { renameFile } from '$utils/file';

import { updateProfileAction } from './actions';
import { avatarOptions, ProfileSchema, profileSchema } from './schema';

export interface ProfileFormProps {
  user: Session['user'];
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const [showFileUploader, setShowFileUploader] = useState(false);

  const form = useActionForm<ProfileSchema>({
    schema: profileSchema,
    action: updateProfileAction,

    files: {
      fields: [
        {
          key: 'avatar',
          mapKeyTo: 'image',
          fileMap: (file) => renameFile(file, user.id),
        },
      ],
    },

    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      avatar: [],
    },

    onSubmitSuccessful() {
      toast.success('Perfil atualizado com sucesso!');
      router.refresh();
      form.resetField('avatar');
      setShowFileUploader(false);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.submit} className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div
            className="relative cursor-pointer"
            onClick={() => setShowFileUploader(!showFileUploader)}
          >
            <Avatar className="size-40 border ">
              <AvatarImage src={user.image || ''} alt={user?.name || ''} />
              <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>

            <Button
              type="button"
              size="sm"
              variant="coloredOutline"
              className="absolute bottom-4 right-0 p-2 h-6 bg-background hover:bg-background hover:text-primary"
            >
              <CameraIcon className="size-4 mr-2" />
              Alterar
            </Button>
          </div>

          {showFileUploader && (
            <FileUploaderForm
              accept={{
                'image/*': ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.bmp'],
              }}
              form={form}
              wrapperClassName="w-full"
              className="w-full text-sm"
              name="avatar"
              maxFileCount={avatarOptions.maxFileCount}
              maxSize={avatarOptions.maxSize}
            />
          )}
        </div>

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
          className="self-start"
        >
          <SaveIcon className="size-4 mr-2" />
          Salvar alterações
        </Button>
      </form>
    </Form>
  );
}
