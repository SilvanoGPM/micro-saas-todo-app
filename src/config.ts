export const HTTP_KEYS = {
  todo: {
    list: 'todo.list',
    get: 'todo.get',
  },
};

export const STRIPE_PRODUCTS = {
  pro: {
    id: 'price_1Q0YWJJ9ikhb1lLTLFdNysn3',
    name: 'Pro',
    price: 5,

    quota: {
      tasks: 100,
    },
  },

  free: {
    id: 'price_1Q7lbwJ9ikhb1lLTKRUTRaH2',
    name: 'Gratuito',
    price: 0,

    quota: {
      tasks: 5,
    },
  },
};
