import { prisma } from '$libs/prisma';
import { redirectToLogin } from '$utils/redirect-to-login';

export async function verifyIfTokenIsValid(token?: string) {
  if (!token) {
    return redirectToLogin('warning', 'Código inválido');
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
    select: { expires: true },
  });

  if (!verificationToken) {
    return redirectToLogin('warning', 'Código inválido');
  }

  if (verificationToken.expires < new Date()) {
    return redirectToLogin('warning', 'Código expirado');
  }
}
