import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      roles: string;
      stripePriceId?: string | null;
      stripeNotesPaid: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image: string;
    roles: string;
    stripePriceId?: string | null;
    stripeNotesPaid: boolean;
  }
}
