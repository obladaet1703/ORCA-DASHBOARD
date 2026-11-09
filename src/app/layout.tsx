import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'ORCA // Job Hunter Portal',
  description: 'Единый центр поиска работы: мульти-аккаунт hh.ru, Telegram каналы и резюме',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className="bg-[#09090b] text-zinc-100 antialiased min-h-screen flex">
        <AppProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
