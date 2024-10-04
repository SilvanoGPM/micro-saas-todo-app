export const ROUTES = {
  auth: {
    login: '/login',
    verify: '/verify',
    reset: '/reset',
  },

  public: ['/'],

  private: {
    home: {
      path: '/tarefas',
    },

    settings: {
      path: '/configuracoes',
    },
  },
};
