'use client';
import Link from 'next/link';
import { useAuth } from './auth/AuthContext';

export default function Navbar() {
  const { user, logout, setShowAuthModal } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 to-transparent px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-heading text-3xl tracking-widest text-white">
          DANFLIX
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/search" className="text-gray-300 hover:text-white transition text-sm tracking-wide">
            Search
          </Link>
          <Link href="/favorites" className="text-gray-300 hover:text-white transition text-sm tracking-wide">
            Favorites
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              {user}
              <button onClick={logout} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-gray-300">
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)}
              className="text-sm bg-[#e50914] hover:bg-[#f6121d] px-4 py-1.5 rounded font-medium">
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
