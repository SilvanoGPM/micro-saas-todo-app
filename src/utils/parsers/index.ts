/**
 * Converte um valor em número. Se a conversão falhar, retorna um valor padrão.
 *
 * @param number - O valor a ser convertido em número (pode ser uma string, número ou null).
 * @param defaultValue - O valor padrão a ser retornado em caso de falha na conversão (padrão: 0).
 */
export function parseNumber(
  number: string | number | null | undefined,
  defaultValue: number,
) {
  const parsed = Number(
    String(number).replaceAll('R$', '').replaceAll(',', '.') || defaultValue,
  );

  if (Number.isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
}
