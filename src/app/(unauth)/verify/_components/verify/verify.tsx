import { verifyToken } from './actions';

export interface VerifyProps {
  token?: string;
}

export async function Verify({ token }: VerifyProps) {
  await verifyToken(token);

  return null;
}
