import { formatPhoneNumber, formatPrice, getOnlyNumbers, pluralize } from '.';

describe('formatters', () => {
  describe('pluralize', () => {
    test('deve retornar no singular quando o número for 1', () => {
      expect(pluralize(1, 'product')).toBe('1 product');
    });

    test('deve retornar no plural quando o número for diferente de 1', () => {
      expect(pluralize(2, 'product')).toBe('2 products');
    });

    test('deve retornar no plural customizado quando o número for diferente de 1', () => {
      expect(pluralize(2, 'category', 'categories')).toBe('2 categories');
    });

    test('deve retornar no singular sem o número quando o número for 1', () => {
      expect(pluralize(1, 'product', 'products', false)).toBe('product');
    });

    test('deve retornar no plural sem o número quando o número for diferente de 1', () => {
      expect(pluralize(2, 'product', 'products', false)).toBe('products');
    });
  });

  describe('formatPrice', () => {
    test('deve formatar o preço', () => {
      expect(formatPrice(1000)).toBe('R$ 1.000,00');
    });

    test('deve formatar o preço com base nas opções fornecidas', () => {
      expect(
        formatPrice(1000, {
          locale: 'en-US',
          currency: 'USD',
        }),
      ).toBe('$1,000.00');
    });
  });

  describe('getOnlyNumbers', () => {
    test('deve remover todos os caracteres que não são números', () => {
      expect(getOnlyNumbers('abc123-_  \n 456:789')).toBe('123456789');
    });
  });

  describe('formatPhoneNumber', () => {
    test('deve formatar o número de telefone', () => {
      expect(formatPhoneNumber('5511923456789')).toBe('+55 11 92345-6789');
    });

    test('deve lançar um erro se o argumento fornecido tiver menos de 13 caracteres', () => {
      expect(() => formatPhoneNumber('551192345678')).toThrow(
        'Número de telefone inválido',
      );
    });
  });
});
