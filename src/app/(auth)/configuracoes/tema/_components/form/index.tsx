'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';

import { Button } from '$components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '$components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '$components/ui/form';
import { RadioGroup } from '$components/ui/radio-group';

import { themeSchema } from './schema';

const RadioGroupItem = dynamic(
  () => import('$components/ui/radio-group').then((mod) => mod.RadioGroupItem),
  {
    ssr: false,
  },
);

export function ThemeForm() {
  const theme = useTheme();

  const form = useForm({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      theme: theme.theme ?? 'system',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    theme.setTheme(data.theme);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tema</CardTitle>
            <CardDescription>
              Escolha entre um tema claro ou escuro
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormMessage />

                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col sm:flex-row gap-2 md:max-w-md w-full"
                  >
                    <FormItem className="flex-1">
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                        <FormControl>
                          <RadioGroupItem value="light" className="sr-only" />
                        </FormControl>

                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                          <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                              <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                            </div>
                          </div>
                        </div>

                        <span className="block w-full p-2 text-center font-normal">
                          Claro
                        </span>
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex-1">
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                        <FormControl>
                          <RadioGroupItem value="dark" className="sr-only" />
                        </FormControl>

                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                              <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                              <div className="h-4 w-4 rounded-full bg-slate-400" />
                              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                              <div className="h-4 w-4 rounded-full bg-slate-400" />
                              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                          </div>
                        </div>

                        <span className="block w-full p-2 text-center font-normal">
                          Escuro
                        </span>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button
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
