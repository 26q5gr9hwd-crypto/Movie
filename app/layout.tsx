import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthContext';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/auth/AuthModal';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Danflix',
  description: 'Your personal cinema experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[bebasNeue.variable, inter.variable].join(' ')}>
      <body className="min-h-screen bg-[#0a0a0a] font-body">
        <AuthProvider>
          <Navbar />
          <AuthModal />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
