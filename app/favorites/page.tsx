'use client';
import { useAuth } from '@/components/auth/AuthContext';
import { getFavorites, FavoriteMovie } from '@/lib/favorites';
import { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favs, setFavs] = useState<FavoriteMovie[]>([]);
  useEffect(() => { if (user) setFavs(getFavorites(user)); }, [user]);
  if (!user) return (
    <main className="min-h-screen bg-danflix-black pt-24 px-4 flex items-center justify-center">
      <p className="text-gray-500 font-heading text-2xl tracking-wider">Sign in to see your favorites</p>
    </main>
  );
  return (
    <main className="min-h-screen bg-danflix-black pt-24 px-4 sm:px-8">
      <h1 className="font-heading text-4xl tracking-wider text-white mb-8 max-w-7xl mx-auto">MY FAVORITES</h1>
      {favs.length === 0 ? <p className="text-gray-500 text-center mt-20 font-heading text-xl tracking-wider">No favorites yet</p>
      : <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favs.map((m, i) => <MovieCard key={i} movie={{...m, backdrop_path: null, release_date: '', genre_ids: [], vote_count: 0, adult: false, original_language: '', popularity: 0}} />)}
      </div>}
    </main>
  );
}
