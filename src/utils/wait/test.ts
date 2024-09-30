import { wait, waitFailure, waitRandomFailure } from '.';

describe('wait', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('wait', () => {
    test('deve esperar um determinado tempo e retornar um valor pré-definido', async () => {
      const waitPromise = wait(3000, 'done');
      const waitPromiseCallback = jest.fn();

      waitPromise.then(waitPromiseCallback);

      jest.advanceTimersByTime(2000);
      expect(waitPromiseCallback).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1000);

      await expect(waitPromise).resolves.toBe('done');

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
    });
  });

  describe('waitFailure', () => {
    test('deve esperar um determinado tempo e falhar', async () => {
      const waitFailurePromise = waitFailure(3000);
      const waitFailurePromiseCallback = jest.fn();

      waitFailurePromise.catch(waitFailurePromiseCallback);

      jest.advanceTimersByTime(2000);
      expect(waitFailurePromiseCallback).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1000);

      await expect(waitFailurePromise).rejects.toBeUndefined();

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
    });
  });

  describe('waitRandomFailure', () => {
    test('deve esperar um determinado tempo e resolver', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.6);

      const promise = waitRandomFailure(3000, 'done');

      jest.advanceTimersByTime(3000);

      await expect(promise).resolves.toBe('done');

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
    });

    test('deve esperar um determinado tempo e falhar', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.4);

      const promise = waitRandomFailure(3000);

      jest.advanceTimersByTime(3000);

      await expect(promise).rejects.toBeUndefined();

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
    });
  });
});
