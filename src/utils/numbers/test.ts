import { sum } from '.';

describe('numbers', () => {
  describe('sum', () => {
    test('deve somar todos os valores de uma lista númerica', () => {
      expect(sum([1, 2, 3])).toBe(6);
    });
  });
});
