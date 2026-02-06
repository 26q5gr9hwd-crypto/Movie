'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthContext';
import { getFavorites, FavoriteMovie } from '@/lib/favorites';
import FavoriteButton from '@/components/FavoriteButton';

const IMG = 'https://image.tmdb.org/t/p/w300';

const fadeIn = { opacity: 0, y: 20 };
const fadeShow = { opacity: 1, y: 0 };
const stagger = (i: number) => ({ delay: i * 0.05 });

export default function FavoritesPage() {
  const { user, setShowAuthModal } = useAuth();
  const [favs, setFavs] = useState<FavoriteMovie[]>([]);

  useEffect(() => {
    if (user) setFavs(getFavorites(user));
    else setShowAuthModal(true);
  }, [user, setShowAuthModal]);

  if (!user) return (
    <main className="min-h-screen pt-24 flex items-center justify-center">
      <p className="text-gray-400 text-lg">Sign in to see favorites</p>
    </main>
  );

  return (
    <main className="min-h-screen pt-24 px-6 max-w-7xl mx-auto">
      <h1 className="font-heading text-5xl tracking-wider text-white mb-8">MY FAVORITES</h1>
      {!favs.length ? (
        <p className="text-gray-500 text-center mt-20 text-lg">No favorites yet</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favs.map((m, i) => (
            <motion.div key={m.id} initial={fadeIn} animate={fadeShow} transition={stagger(i)}
              className="relative group rounded-lg overflow-hidden bg-[#181818]">
              <img src={IMG + m.poster_path} alt={m.title}
                className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center justify-between">
                  <p className="text-sm truncate mr-2">{m.title}</p>
                  <FavoriteButton movie={m} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
