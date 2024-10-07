import { HttpTodo, Todo } from '$http/todos';
import { Mapper } from '$mappers';
import { formatToNumericDate } from '$utils/formatters';

class TodosMapper extends Mapper<HttpTodo, Todo> {
  protected process(data: HttpTodo) {
    return {
      completedAt: data.completedAt
        ? formatToNumericDate(data.completedAt)
        : null,
    };
  }
}

export const todosMapper = new TodosMapper();
