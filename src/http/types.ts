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
