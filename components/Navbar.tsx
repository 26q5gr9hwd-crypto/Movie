'use client';
import Link from 'next/link';
import { useAuth } from './auth/AuthContext';

export default function Navbar() {
  const { user, logout, setShowAuthModal } = useAuth();
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="font-heading text-3xl tracking-widest text-danflix-red">DANFLIX</Link>
        <div className="flex items-center gap-4">
          <Link href="/search" className="text-white/70 hover:text-white transition-colors" aria-label="Search">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </Link>
          {user && <Link href="/favorites" className="text-white/70 hover:text-danflix-red transition-colors" aria-label="Favorites">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </Link>}
          {user ? <div className="flex items-center gap-3">
            {user}
            <button onClick={logout} className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1 rounded">Sign Out</button>
          </div> : <button onClick={() => setShowAuthModal(true)} className="font-heading tracking-wider text-sm bg-danflix-red hover:bg-[#f6121d] px-4 py-1.5 rounded text-white">SIGN IN</button>}
        </div>
      </div>
    </nav>
  );
}
