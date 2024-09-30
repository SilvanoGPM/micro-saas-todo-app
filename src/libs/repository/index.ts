/**
 * Classe de repositório para salvar, recuperar e remover dados de um storage.
 * Por padrão aqui se utiliza o localStorage.
 */
export class Repository {
  static storage = typeof window !== 'undefined' ? localStorage : undefined;

  /**
   * Salva um valor no storage.
   *
   * @param key - A chave sob a qual o valor será salvo.
   * @param value - O valor a ser salvo, pode ser um objeto ou qualquer outro tipo.
   */
  static save<T extends Record<string, unknown>>(key: string, value: T): void {
    try {
      const valueString = JSON.stringify({ data: value });

      Repository.storage?.setItem(key, valueString);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Recupera um valor do storage.
   *
   * @param key - A chave sob a qual o valor foi salvo.
   */
  static get<T>(key: string): T | null | undefined {
    try {
      const value = Repository.storage?.getItem(key);

      if (value) {
        const { data } = JSON.parse(value);

        return data as T;
      }
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  /**
   * Remove um valor do storage.
   *
   * @param key - A chave do valor a ser removido.
   */
  static remove(key: string) {
    Repository.storage?.removeItem(key);
  }
}
