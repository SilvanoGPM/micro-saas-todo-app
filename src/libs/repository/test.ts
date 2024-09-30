import { Repository } from '.';

const TEST_KEY = 'test-key';

const savedItems = new Map();

const repositoryMock = {
  getItem: (key: string) => {
    return savedItems.get(key);
  },

  setItem: (key: string, value: string) => {
    savedItems.set(key, value);
  },

  removeItem: (key: string) => {
    savedItems.delete(key);
  },

  clear: jest.fn(),
  key: jest.fn(),
  length: 0,
};

describe('Repository', () => {
  const initialStorage = Repository.storage;

  beforeEach(() => {
    jest.clearAllMocks();
    Repository.storage = repositoryMock;

    jest.spyOn(console, 'error');
  });

  afterAll(() => {
    Repository.storage = initialStorage;
  });

  describe('save', () => {
    test('deve salvar um dado com sucesso', () => {
      const data = { value: 'test-value' };

      Repository.save(TEST_KEY, data);

      expect(savedItems.get(TEST_KEY)).toBe(JSON.stringify({ data }));
    });

    test('deve mostrar no console caso um erro aconteça', () => {
      const repositoryMockWithError = {
        ...repositoryMock,
        setItem: () => {
          throw new Error('Expected error');
        },
      };

      Repository.storage = repositoryMockWithError;

      const data = { value: 'test-value' };

      Repository.save(TEST_KEY, data);

      expect(console.error).toHaveBeenCalledWith(new Error('Expected error'));
    });
  });

  describe('get', () => {
    test('deve resgatar um dado com sucesso', () => {
      const data = { value: 'test-value' };

      Repository.save(TEST_KEY, data);

      expect(Repository.get(TEST_KEY)).toStrictEqual(data);
    });

    test('deve retornar null a chave não existir', () => {
      expect(Repository.get('random-key')).toBeNull();
    });

    test('deve mostrar no console caso um erro aconteça', () => {
      const repositoryMockWithError = {
        ...repositoryMock,
        getItem: () => {
          throw new Error('Expected error');
        },
      };

      Repository.storage = repositoryMockWithError;

      expect(Repository.get(TEST_KEY)).toBeNull();

      expect(console.error).toHaveBeenCalledWith(new Error('Expected error'));
    });
  });

  describe('remove', () => {
    test('deve remover um dado com sucesso', () => {
      const data = { value: 'test-value' };

      Repository.save(TEST_KEY, data);
      Repository.remove(TEST_KEY);

      expect(repositoryMock.getItem(TEST_KEY)).toBeFalsy();
    });
  });
});
