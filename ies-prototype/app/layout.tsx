import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/400.css';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { Shell } from '@/components/shell/Shell';

export const metadata: Metadata = {
  title: 'Orbit — AI-native business platform for the mid-market',
  description: 'Clickable prototype: Intuit Enterprise Suite evolves from a system of record into a system of action.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
