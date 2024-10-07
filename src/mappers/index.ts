import { BaseEntity } from '$http/types';
import { formatToNumericDate } from '$utils/formatters';

export abstract class Mapper<I extends BaseEntity, O> {
  constructor() {
    this.map = this.map.bind(this);
  }

  protected abstract process(data: I): Partial<O>;

  map(data: I): O {
    const processedData = this.process(data);

    return {
      ...data,
      ...processedData,

      createdAt: formatToNumericDate(data.createdAt),
      updatedAt: formatToNumericDate(data.updatedAt),

      __raw: data,
    } as O;
  }
}
