import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export function applyTokenToSession(token: JWT, session: Session) {
  session.user.id = token.id;
  session.user.name = token.name;
  session.user.email = token.email;
  session.user.image = token.image;
  session.user.roles = token.roles;

  return session;
}
