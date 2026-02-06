'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { getFavorites, FavoriteMovie } from '@/lib/favorites';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';

export default function FavoritesPage() {
  const { user, setShowAuthModal } = useAuth();
  const [favs, setFavs] = useState<FavoriteMovie[]>([]);

  useEffect(() => {
    if (user) setFavs(getFavorites(user));
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen bg-danflix-black pt-24 px-4 flex flex-col items-center justify-center">
        <p className="text-gray-400 text-lg mb-4">Sign in to see your favorites</p>
        <button onClick={() => setShowAuthModal(true)} className="bg-danflix-red text-white font-heading text-xl tracking-wider px-6 py-2 rounded">SIGN IN</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-danflix-black pt-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-4xl tracking-wider text-white mb-8">MY FAVORITES</h1>
        {favs.length === 0 ? (
          <p className="text-gray-500 text-lg">No favorites yet. Browse movies and tap the heart to save them.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favs.map(f => <MovieCard key={f.id} movie={f as unknown as Movie}/>)}
          </div>
        )}
      </div>
    </main>
  );
}
