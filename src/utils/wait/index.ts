/**
 * Retorna uma promessa que resolve após um tempo determinado.
 *
 * @param ms - O tempo em milissegundos para esperar antes de resolver a promessa.
 * @param data - Os dados opcionais a serem resolvidos pela promessa.
 */
export function wait<T>(ms: number, data?: T): Promise<T | undefined> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(data);
    }, ms),
  );
}

/**
 * Retorna uma promessa que rejeita após um tempo determinado.
 *
 * @param ms - O tempo em milissegundos para esperar antes de rejeitar a promessa.
 */
export function waitFailure(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => {
      reject();
    }, ms),
  );
}

/**
 * Retorna uma promessa que resolve ou rejeita aleatoriamente após um tempo determinado.
 *
 * @param ms - O tempo em milissegundos para esperar antes de resolver ou rejeitar a promessa.
 * @param data - Os dados opcionais a serem resolvidos pela promessa.
 */
export function waitRandomFailure<T>(
  ms: number,
  data?: T,
): Promise<T | undefined> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (Math.random() >= 0.5) {
        return resolve(data);
      }

      return reject();
    }, ms),
  );
}
