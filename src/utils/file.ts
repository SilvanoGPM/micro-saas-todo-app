import Compressor from 'compressorjs';

export interface CompressImageParams {
  file: File | Blob;
  quality: number;
}

export async function compressImage({ file, quality }: CompressImageParams) {
  if (!fileIsImage(file)) {
    return file;
  }

  return new Promise<File | Blob>((resolve) => {
    new Compressor(file, {
      quality,

      success(result) {
        return resolve(result);
      },

      error() {
        return resolve(file);
      },
    });
  });
}

export function getFileMB(size?: File | Blob | number) {
  if (!size) {
    return 0;
  }

  const fileSizeInBytes = typeof size === 'number' ? size : size.size;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

  return Math.round(fileSizeInMB * 100) / 100;
}

// Está função da erro de CORS em desenvolvimento.
export async function urlToFile(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch file (status ${response.status})`);
  }
  const blob = await response.blob();

  const filename = url.substring(url.lastIndexOf('/') + 1);

  const file = new File([blob], filename, { type: blob.type });

  return file;
}

export function isImage(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.bmp'];

  const urlParts = url.split('.');
  const extension = urlParts[urlParts.length - 1].toLowerCase();

  return imageExtensions.includes(`.${extension}`);
}

export function fileIsImage(file: File | Blob) {
  return file.type.startsWith('image');
}

export async function isImageAsync(url: string) {
  try {
    const res = await fetch(url);
    const file = await res.blob();

    return fileIsImage(file);
  } catch {
    return false;
  }
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {},
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytest' : sizes[i] ?? 'Bytes'
  }`;
}
