'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  BellDotIcon,
  BellIcon,
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  HashIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  TagsIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CheckboxForm } from '$components/form/checkbox-form';
import { CheckboxGroupForm } from '$components/form/checkbox-group-form';
import { ComboboxForm } from '$components/form/combobox-form';
import { FileUploaderForm } from '$components/form/file-uploader-form';
import { InputCurrencyForm } from '$components/form/input-currency-form';
import { InputDatePickerForm } from '$components/form/input-date-picker-form';
import { InputForm } from '$components/form/input-form';
import { InputMaskForm } from '$components/form/input-mask-form';
import { InputNumberForm } from '$components/form/input-number-form';
import { InputPasswordForm } from '$components/form/input-password-form';
import { RadioGroupForm } from '$components/form/radio-group-form';
import { SwitchForm } from '$components/form/switch-form';
import { TextareaForm } from '$components/form/texteara-form';
import { Avatar, AvatarFallback, AvatarImage } from '$components/ui/avatar';
import { Button } from '$components/ui/button';
import { Form } from '$components/ui/form';
import { GetParams } from '$http/types';
import { getUsers } from '$http/users';
import { useCacheFn } from '$libs/react-query';
import { usersToOptions } from '$mappers/users';
import { cn } from '$utils/cn';
import { handleError } from '$utils/handle-error';
import { waitRandomFailure } from '$utils/wait';

import { loadData } from './load-data';
import {
  documentsOptions,
  filesOptions,
  persistFormSchema,
  PersistFormSchema,
} from './schema';

export default function FormPage() {
  const form = useForm<PersistFormSchema>({
    resolver: zodResolver(persistFormSchema),
    defaultValues: loadData,
  });

  const handlePersistForm = form.handleSubmit(async (data) => {
    try {
      await waitRandomFailure(1000);

      toast.success('Sucesso', {
        description: (
          <pre className="mt-2 w-[340px] h-[340px] overflow-scroll rounded-md bg-transparent-950 p-4">
            <code className="text-green-300">
              {JSON.stringify(data, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      handleError(error, 'Não foi possível salvar usuário.');
    }
  });

  const usersOptionsQuery = useCacheFn({
    key: ['users-options'],
    fn: async (params: GetParams) => {
      const { data, ...rest } = await getUsers(params);

      return {
        data: usersToOptions(data),
        ...rest,
      };
    },
  });

  return (
    <main className="p-8 flex flex-col items-center justify-center text-2xl font-bold">
      <Form {...form}>
        <form
          onSubmit={handlePersistForm}
          className="flex flex-col gap-8 w-full max-w-[900px] px-4"
        >
          <div className="flex flex-col md:flex-row gap-4 ">
            <InputForm
              required
              label="Nome"
              labelIcon={UserIcon}
              form={form}
              name="name"
              hint="Nome que vai aparecer para os outros usuários"
              isLoading={form.formState.isLoading}
            />

            <InputForm
              required
              label="E-mail"
              labelIcon={MailIcon}
              form={form}
              type="email"
              name="email"
              isLoading={form.formState.isLoading}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <InputMaskForm
              required
              label="CPF"
              labelIcon={CreditCardIcon}
              form={form}
              name="cpf"
              mask="999.999.999-99"
              placeholder="999.999.999-99"
              maskChar=""
              isLoading={form.formState.isLoading}
            />

            <InputMaskForm
              required
              label="CNPJ"
              labelIcon={CreditCardIcon}
              form={form}
              name="cnpj"
              mask="99.999.999/9999-99"
              placeholder="99.999.999/9999-99"
              maskChar=""
              isLoading={form.formState.isLoading}
            />

            <InputMaskForm
              required
              label="Telefone"
              labelIcon={PhoneIcon}
              form={form}
              name="phone"
              placeholder="(99) 99999-9999"
              mask="(99) 99999-9999"
              maskChar=""
              isLoading={form.formState.isLoading}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <InputNumberForm
              required
              label="Quantidade"
              labelIcon={HashIcon}
              form={form}
              name="quantity"
              isLoading={form.formState.isLoading}
            />

            <InputCurrencyForm
              required
              label="Preço do serviço"
              labelIcon={DollarSignIcon}
              form={form}
              name="money"
              isLoading={form.formState.isLoading}
            />
          </div>

          <InputDatePickerForm
            required
            label="Data de Nascimento"
            labelIcon={CalendarIcon}
            form={form}
            name="date"
            isLoading={form.formState.isLoading}
          />

          <TextareaForm
            label="Sua opinião"
            placeholder="Conte-nos o que você acha desse formulário..."
            labelIcon={MessageCircleIcon}
            form={form}
            name="opinion"
            isLoading={form.formState.isLoading}
          />

          <InputPasswordForm
            required
            label="Senha"
            placeholder="Digite sua senha"
            form={form}
            name="password"
            isLoading={form.formState.isLoading}
          />

          <InputPasswordForm
            required
            label="Confirme a Senha"
            placeholder="Confirme a senha que você digitou"
            form={form}
            name="confirmPassword"
            isLoading={form.formState.isLoading}
          />

          <CheckboxGroupForm
            options={documentsOptions}
            required
            label="Documentos"
            hint="Selecione os documentos que você possui"
            form={form}
            name="docs"
            isLoading={form.formState.isLoading}
          />

          <FileUploaderForm
            form={form}
            required
            label="Imagens dos documentos"
            name="files"
            maxFileCount={filesOptions.maxFileCount}
            maxSize={filesOptions.maxSize}
          />

          <ComboboxForm
            required
            label="Tags"
            labelIcon={TagsIcon}
            multiple
            creatable
            isLoading={form.formState.isLoading || usersOptionsQuery.isLoading}
            form={form}
            name="tags"
            options={[]}
            closeOnSelect={false}
            wrapperClassName="w-full"
            className="flex-1"
            listItemClassName="mb-2"
            popoverClassName="w-[400px]"
            placeholder="Selecione as tags"
          />

          <ComboboxForm
            required
            label="Usuários"
            labelIcon={UsersIcon}
            multiple
            creatable
            isLoading={form.formState.isLoading || usersOptionsQuery.isLoading}
            form={form}
            name="users"
            options={[]}
            asyncParams={{
              infinite: true,
              fn: usersOptionsQuery.fn,
              size: 30,
            }}
            wrapperClassName="w-full"
            className="flex-1"
            listItemClassName="mb-2"
            popoverClassName="w-[400px]"
            searchMessage="Pesquise um usuário"
            placeholder="Escolha os usuários"
            renderOption={(option) => (
              <div className={cn('p-2 flex-1 flex gap-2 items-center')}>
                <Avatar>
                  <AvatarImage
                    alt={option.label}
                    src={option.image}
                    className="w-8 h-8 rounded-full"
                  />

                  <AvatarFallback className="bg-primary text-white">
                    {option.label.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <span>{option.label}</span>
              </div>
            )}
          />

          <SwitchForm
            labelIcon={BellIcon}
            label="Ativar notificações"
            hint="Você quer receber notificações por e-mail?"
            form={form}
            name="allowNotifications"
            isLoading={form.formState.isLoading}
          />

          <RadioGroupForm<PersistFormSchema, 'notificationsType'>
            required
            options={[
              { label: 'Todas', value: 'all' },
              { label: 'Apenas menções', value: 'mentions' },
              { label: 'Apenas coisas importantes', value: 'important' },
            ]}
            labelIcon={BellDotIcon}
            label="Tipo de notificações"
            form={form}
            name="notificationsType"
            isLoading={form.formState.isLoading}
          />

          <CheckboxForm
            label="Aceitar termos"
            hint="Você aceita nossos termos de política de privacidade?"
            form={form}
            name="acceptTerms"
            isLoading={form.formState.isLoading}
          />

          <FileUploaderForm
            form={form}
            required
            label="Sua imagem"
            hint="Para finalizar, nos mande uma imagem sua"
            name="file"
            multiple={false}
            maxSize={filesOptions.maxSize}
          />

          <Button
            isLoading={form.formState.isLoading || form.formState.isSubmitting}
          >
            Enviar
          </Button>
        </form>
      </Form>
    </main>
  );
}
