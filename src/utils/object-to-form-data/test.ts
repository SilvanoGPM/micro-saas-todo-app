import { objectToFormData } from '.';

describe('objectToFormData', () => {
  test('deve transformar um objet qualquer em um FormData', () => {
    const received = objectToFormData({ name: 'user-test', age: 30 });

    expect(received).toBeInstanceOf(FormData);
    expect(received.get('name')).toBe('user-test');
    expect(received.get('age')).toBe('30');
  });
});
