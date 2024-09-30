import { toAlphaHex } from '.';

describe('toAlphaHex', () => {
  test('deve transformar uma cor em formato hexadecimal em uma cor em formato hexadecimal com alfa', () => {
    expect(toAlphaHex('#FFFFFF')).toBe('#FFFFFFFF');
    expect(toAlphaHex('#000000')).toBe('#000000FF');
    expect(toAlphaHex('#FFFFFF', 50)).toBe('#FFFFFF7F');
    expect(toAlphaHex('#000000', 50)).toBe('#0000007F');
  });

  test('deve transformar uma cor em formato hexadecimal reduzido em uma cor em formato hexadecimal com alfa', () => {
    expect(toAlphaHex('#FFF')).toBe('#FFFFFFFF');
    expect(toAlphaHex('#000')).toBe('#000000FF');
    expect(toAlphaHex('#FFF', 50)).toBe('#FFFFFF7F');
    expect(toAlphaHex('#000', 50)).toBe('#0000007F');
  });

  test('deve retornar a string original caso não seja um hexadecimal válido', () => {
    expect(toAlphaHex('red')).toBe('red');
  });
});
