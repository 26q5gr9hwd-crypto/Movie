'use client';
import { ReactNode } from 'react';
import { AuthProvider } from './auth/AuthContext';
import AuthModal from './auth/AuthModal';
import Navbar from './Navbar';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <AuthModal />
      {children}
    </AuthProvider>
  );
}
