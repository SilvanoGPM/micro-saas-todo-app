import { useMediaQuery } from '$hooks/use-media-query';

/**
 * Hook que determina se o usuário prefere reduzir movimentos animados.
 *
 * @returns O valor que indica se o usuário prefere reduzir movimentos animados.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
