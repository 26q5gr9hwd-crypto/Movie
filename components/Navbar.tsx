'use client';
import Link from 'next/link';
import { useAuth } from './auth/AuthContext';

export default function Navbar() {
  const { user, logout, setShowAuthModal } = useAuth();
  const ic = "text-white/70 hover:text-white transition-colors";
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-heading text-3xl tracking-widest text-danflix-red">DANFLIX</Link>
        <div className="flex items-center gap-4">
          <Link href="/search" className={ic} aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Link>
          {user && <Link href="/favorites" className={ic} aria-label="Favorites">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </Link>}
          {user ? <div className="flex items-center gap-3">
            <span className="text-sm text-white/70">{user}</span>
            <button onClick={logout} className="text-sm text-white/50 hover:text-white">Sign Out</button>
          </div> : <button onClick={()=>setShowAuthModal(true)} className="bg-danflix-red text-white font-heading text-lg tracking-wider px-4 py-1.5 rounded">SIGN IN</button>}
        </div>
      </div>
    </nav>
  );
}
