import * as immer from 'immer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionHandlerMap<S, A extends { type: string; payload: any }> = {
  [K in A['type']]: (
    /** Estado do atual */
    state: S,

    /** Dados da ação */
    payload: Extract<A, { type: K }>['payload'],
  ) => S | void;
};

/**
 * Cria um `reducer` a partir de um objeto de ações que manipulam o estado
 * baseado no tipo da ação e os dados que esta ação recebe.
 *
 * Por baixo dos panos, se utiliza a biblioteca `immer` para criar estados sempre imutáveis.
 *
 * @param actions Objeto de ações que manipulam o estado.
 *
 * @returns Um `reducer` que recebe o estado atual e a ação e retorna um novo estado.
 *
 * @see https://immerjs.github.io/immer/ Documentação da biblioteca immer.js
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createReducer<S, A extends { type: string; payload: any }>(
  actions: ActionHandlerMap<S, A>,
) {
  return (state: S, action: A) => {
    const { type, payload } = action;

    const handler = actions[type as A['type']];

    if (handler) {
      return immer.produce(state, (draftState: S) =>
        handler(draftState, payload),
      );
    }

    console.warn(`Nenhuma ação com o tipo ${type} encontrada.`);

    return state;
  };
}
