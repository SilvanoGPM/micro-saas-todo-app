import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Table',
};

export default function TableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
