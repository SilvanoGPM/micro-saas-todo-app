'use client';

import { FileTextIcon, UploadIcon, XIcon } from 'lucide-react';
import * as React from 'react';
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '$components/ui/button';
import { Progress } from '$components/ui/progress';
import { ScrollArea } from '$components/ui/scroll-area';
import { useControllableState } from '$hooks/use-controllable-state';
import { cn } from '$utils/cn';
import { formatBytes } from '$utils/file';

export type ExtendedFile = File & { url?: string };

export interface FileUploaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type ExtendedFile[]
   * @default undefined
   * @example value={files}
   */
  value?: ExtendedFile[];

  /**
   * Function to be called when the value changes.
   * @type (files: ExtendedFile[]) => void
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: (files: ExtendedFile[]) => void;

  /**
   * Function to be called when files are uploaded.
   * @type (files: ExtendedFile[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: ExtendedFile[]) => Promise<void>;

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps['accept'];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps['maxSize'];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFileCount={4}
   */
  maxFileCount?: DropzoneProps['maxFiles'];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;

  isInvalid?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = {
      'image/*': [],
    },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    isInvalid = false,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        toast.error('Você não pode enviar mais de um arquivo');
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
        toast.error(`Você não pode enviar mais de ${maxFileCount} arquivos`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`Arquivo ${file.name} foi rejeitado`);
        });
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFileCount
      ) {
        const target =
          updatedFiles.length > 0
            ? `${updatedFiles.length} arquivos`
            : `arquivo`;

        toast.promise(onUpload(updatedFiles), {
          loading: `Envinado ${target}...`,
          success: () => {
            setFiles([]);
            return `${target} enviados`;
          },
          error: `Erro ao enviar ${target}`,
        });
      }
    },

    [files, maxFileCount, multiple, onUpload, setFiles],
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount;

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFileCount}
        multiple={maxFileCount > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50',
              isDisabled && 'pointer-events-none opacity-60',
              isInvalid && 'border-destructive',
              className,
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-medium text-muted-foreground">
                  Jogue os arquivos aqui
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div
                  className={cn('rounded-full border border-dashed p-3', {
                    'border-destructive': isInvalid,
                  })}
                >
                  <UploadIcon
                    className={cn({
                      'text-destructive': isInvalid,
                    })}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-px">
                  <p
                    className={cn(
                      'font-medium text-muted-foreground text-sm md:text-lg',
                      {
                        'text-destructive': isInvalid,
                      },
                    )}
                  >
                    Jogue os arquivos aqui, ou clique para selecionar arquivos
                  </p>
                  <p
                    className={cn('text-sm text-muted-foreground/70', {
                      'text-destructive': isInvalid,
                    })}
                  >
                    Você pode enviar
                    {maxFileCount > 1
                      ? ` ${
                          maxFileCount === Infinity ? 'multiple' : maxFileCount
                        }
                      arquivos (com no máximo ${formatBytes(maxSize)} cada um)`
                      : ` um arquivo com ${formatBytes(maxSize)} no máximo`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="flex max-h-48 flex-col gap-4">
            {files?.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}

interface FileCardProps {
  file: ExtendedFile;
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center gap-2.5">
      <div className="flex flex-1 gap-2.5">
        {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={onRemove}
        >
          <XIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">Remover arquivo</span>
        </Button>
      </div>
    </div>
  );
}

function isFileWithPreview(
  file: ExtendedFile,
): file is ExtendedFile & { preview: string } {
  return (
    ('preview' in file && typeof file.preview === 'string') ||
    ('url' in file && typeof file.url === 'string')
  );
}

interface FilePreviewProps {
  file: ExtendedFile & { preview: string };
}

function FilePreview({ file }: FilePreviewProps) {
  if (file.type.startsWith('image/')) {
    return (
      <img
        src={file?.url || file.preview}
        alt={file.name}
        width={48}
        height={48}
        loading="lazy"
        className="aspect-square shrink-0 rounded-md object-cover"
      />
    );
  }

  return (
    <FileTextIcon
      className="size-10 text-muted-foreground"
      aria-hidden="true"
    />
  );
}
