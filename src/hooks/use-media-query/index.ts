import * as React from 'react';

/**
 * Hook personalizado para avaliar uma media query e retornar seu estado.
 *
 * @param query - A media query a ser avaliada.
 * @returns O valor que indica se a media query está sendo satisfeita.
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener('change', onChange);
    setValue(result.matches);

    return () => result.removeEventListener('change', onChange);
  }, [query]);

  return value;
}
