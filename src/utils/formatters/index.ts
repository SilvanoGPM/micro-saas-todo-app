import { formatDate } from '$libs/date-fns';

/**
 * Pluraliza uma palavra com base no número fornecido.
 *
 * @param n - O número para determinar a pluralização.
 * @param singular - A forma singular da palavra.
 * @param plural - A forma plural da palavra. Se não fornecida, será gerada adicionando 's' ao singular.
 * @param useNumber - Se true, inclui o número no resultado (padrão: true).
 */
export function pluralize(
  n: number,
  singular: string,
  plural?: string,
  useNumber = true,
) {
  const text = n === 1 ? singular : plural || singular + 's';

  if (!useNumber) {
    return text;
  }

  return `${n} ${text}`;
}

/**
 * Formata um valor como preço em um determinado local e moeda.
 *
 * @param value - O valor a ser formatado.
 * @param locale - O local a ser usado para a formatação (padrão: 'pt-BR').
 * @param options - Opções para o formatador.
 */
export function formatPrice(
  value: string | number,
  {
    locale = 'pt-BR',
    currency = 'BRL',
    ...options
  }: Intl.NumberFormatOptions & { locale?: string } = {},
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  })
    .format(Number(String(value).replaceAll(',', '.')))
    .replace(/[\s\uFEFF\xA0]+/g, ' '); // Remover espaços invisíveis
}

/**
 * Remove todos os caracteres não numéricos de uma string.
 *
 * @param string - A string da qual serão removidos todos os caracteres que não sejam números.
 */
export function getOnlyNumbers(string: string) {
  return string.replace(/\D/g, '');
}

/**
 * Formata um número de telefone, removendo todos os caracteres não numéricos e organizando-o no estilo +55 01 23456-7890.
 *
 * @param {string | number} phone - O número de telefone a ser formatado. Pode ser uma string ou um número.
 *
 * @returns {string} - O número de telefone formatado.
 *
 * @example
 * formatPhoneNumber("5511923456789"); // -> "+55 11 92345-6789"
 *
 * @example
 * formatPhoneNumber(5521912345678); // -> "+55 11 92345-6789"
 *
 * @throws Se o `phone` for menor que 13 caracteres. (`Número de telefone inválido`)
 */
export function formatPhoneNumber(phone: string | number): string {
  const phoneStr = String(phone);

  const onlyNumbers = getOnlyNumbers(phoneStr);

  if (onlyNumbers.length < 13) {
    throw new Error('Número de telefone inválido');
  }

  const country = onlyNumbers.slice(0, 2);
  const area = onlyNumbers.slice(2, 4);
  const part1 = onlyNumbers.slice(4, 9);
  const part2 = onlyNumbers.slice(9, 13);

  return `+${country} ${area} ${part1}-${part2}`;
}

export function formatToISOString(date: string | Date) {
  return new Date(date).toISOString();
}

export function formatToNumericDate(date: string | Date) {
  return formatDate(date, 'dd/MM/yyyy');
}
