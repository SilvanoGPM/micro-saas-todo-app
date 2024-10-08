import { Metadata } from 'next';

import { ThemeForm } from './_components/form';

export const metadata: Metadata = {
  title: 'Tema',
};

export default function SettingsThemePage() {
  return <ThemeForm />;
}
