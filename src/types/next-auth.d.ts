import { User } from '@prisma/client';

import { Replace } from '$utils/replace';

declare module 'next-auth' {
  interface Session {
    user: Replace<User, { email: string }>;
  }
}
