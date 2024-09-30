import { getFirstString, slugToString, stringToSlug, titleString } from '.';

describe('strings', () => {
  describe('titleString', () => {
    test('deve transformar uma string em uma string com a primeira letra em maiúscula e o resto em minúscula', () => {
      expect(titleString('str')).toBe('Str');
      expect(titleString('str str')).toBe('Str str');
      expect(titleString('str-str')).toBe('Str-str');
      expect(titleString('str_str')).toBe('Str_str');
    });
  });

  describe('getFirstString', () => {
    test('deve retornar a primeira parte de uma string separada por um delimitador', () => {
      expect(getFirstString('str str')).toBe('str');
      expect(getFirstString('str str', '-')).toBe('str str');
      expect(getFirstString('str-str', '-')).toBe('str');
      expect(getFirstString('str-str', ' ')).toBe('str-str');
    });
  });

  describe('slugToString', () => {
    test('deve converter um slug de URL em uma string legível', () => {
      expect(slugToString('str-slug_123')).toBe('str slug 123');
    });
  });

  describe('stringToSlug', () => {
    test('deve converter uma string em um slug', () => {
      expect(stringToSlug('str slug_123 éa-ha?')).toBe('str-slug_123-ea-ha');
    });
  });
});
