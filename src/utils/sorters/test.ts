import { primitiveSorters, sortByKey } from '.';

describe('sorters', () => {
  describe('primitiveSorters', () => {
    test('deve ordernar uma lista de booleanos', () => {
      const expected = [true, true, false, false];

      const received = [false, true, false, true].sort(
        primitiveSorters.boolean,
      );

      expect(received).toStrictEqual(expected);
    });

    test('deve ordernar uma lista de números', () => {
      const expected = [1, 2, 3, 4];

      const received = [3, 1, 4, 2].sort(primitiveSorters.number);

      expect(received).toStrictEqual(expected);
    });

    test('deve ordernar uma lista de strings', () => {
      const expected = ['a', 'b', 'c', 'd'];

      const received = ['c', 'd', 'a', 'b'].sort(primitiveSorters.string);

      expect(received).toStrictEqual(expected);
    });
  });

  describe('sortByKey', () => {
    test('deve ordernar uma lista de objetos pelo tipo de uma propriedade em ordem ascendente', () => {
      const users = [
        { name: 'Jonh Doe', age: 20, inactive: false },
        { name: 'Krugger Jones', age: 14, inactive: true },
        { name: 'Mary Clark', age: 32, inactive: false },
        { name: 'Zoe Smith', age: 49, inactive: true },
      ];

      expect(
        sortByKey(users, 'inactive').map((user) => user.inactive),
      ).toStrictEqual([true, true, false, false]);

      expect(sortByKey(users, 'age')).toStrictEqual([
        { name: 'Krugger Jones', age: 14, inactive: true },
        { name: 'Jonh Doe', age: 20, inactive: false },
        { name: 'Mary Clark', age: 32, inactive: false },
        { name: 'Zoe Smith', age: 49, inactive: true },
      ]);

      expect(sortByKey(users, 'name')).toStrictEqual([
        { name: 'Jonh Doe', age: 20, inactive: false },
        { name: 'Krugger Jones', age: 14, inactive: true },
        { name: 'Mary Clark', age: 32, inactive: false },
        { name: 'Zoe Smith', age: 49, inactive: true },
      ]);
    });

    test('deve ordernar uma lista de objetos pelo tipo de uma propriedade em ordem descendente', () => {
      const users = [
        { name: 'Jonh Doe', age: 20, inactive: false },
        { name: 'Krugger Jones', age: 14, inactive: true },
        { name: 'Mary Clark', age: 32, inactive: false },
        { name: 'Zoe Smith', age: 49, inactive: true },
      ];

      expect(
        sortByKey(users, 'inactive', true).map((user) => user.inactive),
      ).toStrictEqual([false, false, true, true]);

      expect(sortByKey(users, 'age', true)).toStrictEqual([
        { name: 'Zoe Smith', age: 49, inactive: true },
        { name: 'Mary Clark', age: 32, inactive: false },
        { name: 'Jonh Doe', age: 20, inactive: false },
        { name: 'Krugger Jones', age: 14, inactive: true },
      ]);

      expect(sortByKey(users, 'name', true)).toStrictEqual([
        { name: 'Zoe Smith', age: 49, inactive: true },
        { name: 'Mary Clark', age: 32, inactive: false },
        { name: 'Krugger Jones', age: 14, inactive: true },
        { name: 'Jonh Doe', age: 20, inactive: false },
      ]);
    });

    test('deve retornar a propria lista caso não seja possível determinar o ordenador dos valores', () => {
      const users = [
        { name: 'Jonh Doe', age: 20, inactive: false },
        { name: 'Krugger Jones', age: 14, inactive: true },
        { name: 'Mary Clark', age: 32, inactive: false },
        { name: 'Zoe Smith', age: 49, inactive: true },
      ];

      users.forEach((user) => {
        // Erro de tipagem intencional
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user.age = Symbol(user.age) as any;
      });

      expect(sortByKey(users, 'age')).toStrictEqual(users);
    });

    test('deve retornar uma lista vazia caso a lista esteja vazia', () => {
      expect(sortByKey<{ name: string }>([], 'name')).toStrictEqual([]);
    });
  });
});
