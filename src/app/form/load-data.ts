import { ExtendedFile } from '$components/ui/file-uploader';
import { getUsers } from '$http/users';
import { usersToOptions } from '$mappers/users';
import { urlToFile } from '$utils/file';

import { PersistFormSchema } from './schema';

export async function loadData() {
  const users = await getUsers({ size: 2, page: 1 });

  const files = await Promise.all(
    ['http://localhost:3000/images/example.jpeg'].map(async (url) => {
      const file = (await urlToFile(url)) as ExtendedFile;

      file.url = url;

      return file;
    }),
  );

  const result: PersistFormSchema = {
    name: 'Silvano',
    email: 'silvano@mail.com',
    opinion: 'Curti bastante como ficou o modelo dele!',
    users: usersToOptions(users.data),
    tags: [{ label: '#Programação', value: '#Programação' }],
    password: '12345678',
    confirmPassword: '12345678',
    cpf: '715.566.424-31',
    cnpj: '68.128.503/0001-80',
    phone: '(87) 98135-6579',
    date: new Date().toISOString(),
    files,
    file: files,
    money: 100,
    quantity: 5,
    allowNotifications: true,
    notificationsType: 'important',
    acceptTerms: true,
    docs: ['rg', 'cnh'],
  };

  return result;
}
