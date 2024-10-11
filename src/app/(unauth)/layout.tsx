import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-dvh flex items-center justify-center">{children}</main>
  );
}
