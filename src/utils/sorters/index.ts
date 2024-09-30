// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const primitiveSorters: Record<string, (a: any, b: any) => number> = {
  boolean: (a: boolean, b: boolean) => (a === b ? 0 : a ? -1 : 1),
  number: (a: number, b: number) => a - b,
  string: (a: string, b: string) => a.localeCompare(b),
};

/** Restringe os valores possíveis para uma chave de um objeto para apenas os primitivos (string | number | boolean). */
type PrimitiveKey<T> = Extract<
  keyof T,
  {
    [K in keyof T]: T[K] extends string | number | boolean ? K : never;
  }[keyof T]
>;

/**
 * Ordena um array de objetos com base no valor de uma chave específica.
 *
 * @param array - O array de objetos a ser ordenado.
 * @param key - A chave do objeto pela qual a ordenação será realizada, somente valores primitivos são aceitos (number | string | boolean).
 * @param reverse - Se `true`, a ordenação será invertida (padrão: `false`).
 */
export function sortByKey<T>(
  array: T[],
  key: PrimitiveKey<T>,
  reverse = false,
) {
  if (array.length === 0) {
    return array;
  }

  // Basta transformar 1 em -1 e vice versa para inverter a ordenação
  const reverseOperator = reverse ? -1 : 1;

  // Determinar o tipo da propriedade que será utilizada
  const valueBasedOnKey = array[0][key];

  const sorter = primitiveSorters[typeof valueBasedOnKey];

  if (!sorter) {
    console.warn(`Sorter não encontrado para o tipo ${typeof key}`);

    return array;
  }

  const sortedArray = array.sort((a, b) => {
    return sorter(a[key], b[key]) * reverseOperator;
  });

  return sortedArray;
}
