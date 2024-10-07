import { Replace } from '$utils/replace';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type MappedEntity<E, T = unknown> = Replace<E, T> & {
  __raw: E;
};

export interface Page<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export interface GetParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
}
