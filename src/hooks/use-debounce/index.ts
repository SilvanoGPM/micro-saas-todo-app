import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook personalizado para debouncing de funções.
 *
 * @param delay - O tempo de atraso em milissegundos (padrão: 1500).
 * @param notDelayInFistTime - Se `true`, não aplica o atraso na primeira chamada (padrão: `false`).
 */
export function useDebounce(delay = 1500, notDelayInFistTime = false) {
  const debouncing = useRef<NodeJS.Timeout | undefined>();
  const isFirstTime = useRef(notDelayInFistTime);

  const debounce = useCallback(
    (func: () => void) => {
      if (isFirstTime.current) {
        isFirstTime.current = false;
        func();
      } else {
        if (debouncing.current) {
          clearTimeout(debouncing.current);
        }
        debouncing.current = setTimeout(() => func(), delay);
      }
    },
    [delay],
  );

  // Previne que o debounce seja executado depois do hook ser desmontado
  useEffect(() => {
    return () => {
      if (debouncing.current) {
        clearTimeout(debouncing.current);
      }
    };
  }, []);

  return { debounce, timeoutId: debouncing };
}
