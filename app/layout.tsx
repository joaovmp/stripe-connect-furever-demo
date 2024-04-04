'use client';

import {Inter as FontSans} from 'next/font/google';
import {cn} from '@/lib/utils';
import './globals.css';
import NextAuthProvider from './auth';
import DebugMenu from '@/app/components/debug/DebugMenu';
import {EmbeddedComponentBorderProvider} from '@/app/hooks/EmbeddedComponentBorderProvider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Pose</title>
      </head>
      <body
        className={cn(
          'min-h-screen bg-offset font-sans antialiased',
          fontSans.variable
        )}
      >
        <NextAuthProvider>
          <EmbeddedComponentBorderProvider>
            {children}
          </EmbeddedComponentBorderProvider>
          <DebugMenu />
        </NextAuthProvider>
      </body>
    </html>
  );
}
