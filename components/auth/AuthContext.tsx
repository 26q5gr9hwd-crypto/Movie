'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, login as doLogin, register as doRegister, logout as doLogout } from '@/lib/auth';

interface AuthCtx {
  user: string | null;
  login: (u: string, p: string) => Promise<boolean>;
  register: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (v: boolean) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => { setUser(getCurrentUser()); }, []);

  const login = async (u: string, p: string) => {
    const ok = await doLogin(u, p);
    if (ok) setUser(u);
    return ok;
  };

  const register = async (u: string, p: string) => {
    const ok = await doRegister(u, p);
    if (ok) setUser(u);
    return ok;
  };

  const logout = () => { doLogout(); setUser(null); };

  const val = { user, login, register, logout, showAuthModal, setShowAuthModal };

  return (
    <Ctx.Provider value={val}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
}
