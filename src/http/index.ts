import { Mapper } from '$mappers';

import { BaseEntity, Page } from './types';

export function applyMapper<I extends BaseEntity, O>(
  mapper: Mapper<I, O>,
  input: Page<I>,
): Page<O>;

export function applyMapper<I extends BaseEntity, O>(
  mapper: Mapper<I, O>,
  input: I,
): O;

export function applyMapper<I extends BaseEntity, O>(
  mapper: Mapper<I, O>,
  input: Page<I> | I,
): Page<O> | O {
  if ('data' in input && Array.isArray(input.data)) {
    return {
      ...input,
      data: input.data.map(mapper.map),
    } as Page<O>;
  }

  return mapper.map(input as I) as O;
}
