import { parseNumber } from '.';

describe('parsers', () => {
  describe('parseNumber', () => {
    test('deve transformar uma string em um número', () => {
      expect(parseNumber('10', 0)).toBe(10);
      expect(parseNumber('10.5', 0)).toBe(10.5);
      expect(parseNumber('12,5', 0)).toBe(12.5);
      expect(parseNumber('R$5.25', 0)).toBe(5.25);
      expect(parseNumber('R$3,1415', 0)).toBe(3.1415);
    });

    test('deve retornar um valor padrão caso não seja possível converter o número', () => {
      expect(parseNumber('NaN', 10)).toBe(10);
      expect(parseNumber('', 0.1)).toBe(0.1);
      expect(parseNumber(null, 15.5)).toBe(15.5);
      expect(parseNumber(undefined, 1234.56)).toBe(1234.56);
    });
  });
});
