/**
 * Converte a primeira letra de uma string para maiúscula e o restante para minúscula.
 *
 * @param string - A string a ser convertida.
 */
export function titleString(string: string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * Retorna a primeira parte de uma string separada por um delimitador.
 *
 * @param string - A string a ser separada.
 * @param delimitter - O delimitador para separar a string (padrão: ' ').
 */
export function getFirstString(string: string, delimitter = ' ') {
  return string.split(delimitter)[0];
}

/**
 * Converte um slug de URL em uma string legível.
 *
 * @param slug - O slug da URL.
 *
 * @example
 * slugToString("teste-slug_123"); // -> "teste slug"
 */
export function slugToString(slug: string) {
  return slug
    .replace(/[-_]/g, ' ') // Substitui hifens por espaços
    .trim(); // Remove espaços extras
}

/**
 * Converte uma string em um slug de URL.
 *
 * @param name - A string a ser convertida.
 *
 * @example
 * stringToSlug("teste slug"); // -> "teste-slug"
 */
export function stringToSlug(string: string) {
  return string
    .toLowerCase()
    .trim()
    .normalize('NFD') // Remover acentuações
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas de diacríticos
    .replace(/\s+/g, '-') // Substitui espaços por hifens
    .replace(/[^\w-]+/g, '') // Remove caracteres especiais
    .replace(/--+/g, '-'); // Substitui hifens repetidos por um único hifen
}
