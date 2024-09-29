import { auth } from '@/auth';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import TanstackProvider from '@/providers/TanstackProvider';
import '@uploadthing/react/styles.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'nextjs13', 'next13', 'pwa', 'next-pwa'],
  // themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#fff' }],

  icons: [
    { rel: 'apple-touch-icon', url: 'static/icons/icon-144x144.png' },
    { rel: 'icon', url: 'static/icons/icon-144x144.png' }
  ]
};

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <NextTopLoader />
        <Providers session={session}>
          <Toaster />
          <TanstackProvider>{children}</TanstackProvider>
        </Providers>
      </body>
    </html>
  );
}
