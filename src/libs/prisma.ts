import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export function getPrismaPagination(page: number, size: number) {
  return {
    skip: (page - 1) * size,
    take: size,
  };
}

export function byFieldsContaining<T extends object = object>(
  fields: Array<keyof T>,
  search?: string,
) {
  if (!search) {
    return undefined;
  }

  const contains = fields.map((field) => ({
    [field]: {
      contains: search.toLowerCase(),
    },
  }));

  return contains.length > 0 ? contains : undefined;
}
