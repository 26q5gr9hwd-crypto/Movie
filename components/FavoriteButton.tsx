'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './auth/AuthContext';
import { isFavorite, addFavorite, removeFavorite, FavoriteMovie } from '@/lib/favorites';

export default function FavoriteButton({ movie }: { movie: FavoriteMovie }) {
  const { user, setShowAuthModal } = useAuth();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (user) setFav(isFavorite(user, movie.id));
  }, [user, movie.id]);

  const toggle = () => {
    if (!user) { setShowAuthModal(true); return; }
    if (fav) { removeFavorite(user, movie.id); setFav(false); }
    else { addFavorite(user, movie); setFav(true); }
  };

  const tapAnim = { scale: 1.3 };

  return (
    <motion.button whileTap={tapAnim} onClick={toggle} className="text-2xl">
      {fav ? u2665 : u2661}
    </motion.button>
  );
}
