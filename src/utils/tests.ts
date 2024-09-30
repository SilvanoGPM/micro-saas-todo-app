export const listeners: Record<string, (event: MediaQueryListEvent) => void> =
  {};

export function matchMediaMock(matches: boolean) {
  return jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: (
      event: string,
      listener: (e: MediaQueryListEvent) => void,
    ) => {
      listeners[event] = listener;
    },
    removeEventListener: jest.fn((event: string) => {
      delete listeners[event];
    }),
  }));
}
