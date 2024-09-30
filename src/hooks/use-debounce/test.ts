import { act, renderHook } from '@testing-library/react';

import { useDebounce } from '.';

describe('useDebounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('deve executar a função após o delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(1000));

    act(() => {
      result.current.debounce(callback);
    });

    expect(callback).not.toBeCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toBeCalledTimes(1);
  });

  it('deve executar a função sem delay na primeira chamada', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(1000, true));

    act(() => {
      result.current.debounce(callback);
    });

    expect(callback).toBeCalledTimes(1);

    act(() => {
      result.current.debounce(callback);
    });

    expect(callback).toBeCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toBeCalledTimes(2);
  });

  it('deve resetar o tempo de espera caso a função seja chamada novamente antes do delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(1000));

    act(() => {
      result.current.debounce(callback);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      result.current.debounce(callback);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toBeCalledTimes(1);
  });

  it('não deve executar a função o hook seja desmontado antes do delay terminar', () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useDebounce(1000));

    act(() => {
      result.current.debounce(callback);
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toBeCalled();
  });
});
