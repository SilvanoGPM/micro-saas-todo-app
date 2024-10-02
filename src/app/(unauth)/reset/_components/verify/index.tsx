import { ChangePasswordForm } from '../change-password-form';

import { verifyIfTokenIsValid } from './actions';

export interface VerifyProps {
  token?: string;
}

export async function Verify({ token }: VerifyProps) {
  await verifyIfTokenIsValid(token);

  return <ChangePasswordForm token={token} />;
}
