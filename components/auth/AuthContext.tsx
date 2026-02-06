'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, login as authLogin, register as authRegister, logout as authLogout } from '@/lib/auth';

interface AuthCtx {
  user: string | null;
  login: (u: string, p: string) => Promise<boolean>;
  register: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
}

const def: AuthCtx = { user: null, login: async () => false, register: async () => false, logout: () => {} };
const Ctx = createContext<AuthCtx>(def);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => { setUser(getCurrentUser()); }, []);

  const login = async (u: string, p: string) => { const ok = await authLogin(u, p); if (ok) setUser(u); return ok; };
  const register = async (u: string, p: string) => { const ok = await authRegister(u, p); if (ok) setUser(u); return ok; };
  const logout = () => { authLogout(); setUser(null); };

  const val: AuthCtx = { user, login, register, logout };
  return <Ctx.Provider value={val}>{children}</Ctx.Provider>;
}
