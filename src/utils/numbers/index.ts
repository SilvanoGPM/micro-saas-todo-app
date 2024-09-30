/**
 * Calcula a soma dos números em um array.
 *
 * @param data - Um array de números a serem somados.
 */
export function sum(data: number[]) {
  return data.reduce((total, item) => {
    return total + item;
  }, 0);
}
