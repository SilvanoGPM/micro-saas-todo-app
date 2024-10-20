'use server';

import { uploadFile } from '$libs/s3';

export async function uploadFileAction(form: FormData) {
  const file = form.get('file') as File;
  const key = (form.get('key') as string) || file.name || crypto.randomUUID();
  const contentType = (form.get('contentType') as string) || file.type;

  return uploadFile({
    file,
    key,
    contentType,
    acl: form.get('acl') as string,
    cacheControl: form.get('cacheControl') as string,
    bucket: form.get('bucket') as string,
    removeUrlQueryParams: Boolean(form.get('removeUrlQueryParams')),
  });
}
