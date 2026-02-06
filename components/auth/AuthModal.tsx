'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

export default function AuthModal() {
  const { showAuthModal: show, setShowAuthModal: setShow, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');

  if (!show) return null;

  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const ok = mode === 'login' ? await login(u, p) : await register(u, p);
    if (ok) { setShow(false); setU(''); setP(''); }
    else setErr(mode === 'login' ? 'Invalid credentials' : 'Username taken');
  };

  const ic = 'w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e50914]';
  const initAnim = { scale: 0.9, opacity: 0 };
  const showAnim = { scale: 1, opacity: 1 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShow(false)}>
      <motion.div initial={initAnim} animate={showAnim}
        className="bg-[#181818] rounded-xl p-8 w-full max-w-sm border border-white/10"
        onClick={e => e.stopPropagation()}>
        <h2 className="font-heading text-4xl tracking-wider text-white mb-6 text-center">
          {mode === 'login' ? 'SIGN IN' : 'REGISTER'}
        </h2>
        <form onSubmit={go} className="space-y-4">
          <input type="text" placeholder="Username" value={u} onChange={e => setU(e.target.value)} required className={ic} />
          <input type="password" placeholder="Password" value={p} onChange={e => setP(e.target.value)} required className={ic} />
          {err && <p className="text-[#e50914] text-sm">{err}</p>}
          <button type="submit" className="w-full bg-[#e50914] hover:bg-[#f6121d] text-white font-heading text-xl tracking-wider py-3 rounded-lg">
            {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}
            className="text-white hover:text-[#e50914]">
            {mode === 'login' ? 'Create account' : 'Sign in instead'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
