/**
 * Adiciona um valor alfa a uma cor em formato hexadecimal.
 *
 * @param hex - A cor em formato hexadecimal (ex: '#RRGGBB').
 * @param percentage - O valor alfa em porcentagem (0 a 100, padrão: 100).
 */
export function toAlphaHex(hex?: string, percentage = 100) {
  if (hex?.length === 4) {
    hex += hex.slice(1);
  }

  if (!hex?.startsWith('#') || hex.length !== 7) {
    return hex;
  }

  return (
    hex +
    `0${Math.round((255 / 100) * percentage).toString(16)}`
      .slice(-2)
      .toUpperCase()
  );
}
