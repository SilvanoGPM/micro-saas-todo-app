import {
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';
import mimeTypes from 'mime-types';

import { env } from '$env';

export const uploadFileSchema = z.object({
  file: z.any(),
  key: z.string(),
  contentType: z.string().optional().nullable(),
  bucket: z.string().optional().nullable(),
  acl: z.string().optional().nullable(),
  cacheControl: z.string().optional().nullable(),
  removeUrlQueryParams: z.boolean().optional().nullable(),
});

export type UploadFileData = z.infer<typeof uploadFileSchema>;

export const s3Client = new S3({
  forcePathStyle: true,
  endpoint: env.SPACES_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: env.SPACES_KEY,
    secretAccessKey: env.SPACES_SECRET,
  },
});

export async function uploadFile(data: UploadFileData) {
  const {
    bucket,
    file,
    key,
    contentType,
    acl,
    cacheControl,
    removeUrlQueryParams = true,
  } = uploadFileSchema.parse(data);

  const mimeType = contentType || file.type;

  const extension =
    mimeType && mimeType !== 'application/octet-stream'
      ? `.${mimeTypes.extension(mimeType)}`
      : '';

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket || env.SPACES_NAME,
      Key: `${key}${extension}`,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: cacheControl || '',
      ACL: (acl as ObjectCannedACL) || 'public-read',
    }),
  );

  let url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucket || env.SPACES_NAME,
      Key: `${key}${extension}`,
    }),
  );

  if (removeUrlQueryParams) {
    url = url.split('?')[0];
  }

  return url;
}
