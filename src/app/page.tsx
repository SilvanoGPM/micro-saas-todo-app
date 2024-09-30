import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

export default function Home() {
  return (
    <main className="p-8 h-screen flex flex-col items-center justify-center text-2xl font-bold">
      <h3 className="text-3xl">Home</h3>
    </main>
  );
}
