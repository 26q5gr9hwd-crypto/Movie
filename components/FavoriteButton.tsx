'use client';
import { motion } from 'framer-motion';
import { useAuth } from './auth/AuthContext';
import { addFavorite, removeFavorite, isFavorite } from '@/lib/favorites';
import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';

export default function FavoriteButton({ movie, size = 'md' }: { movie: Movie; size?: 'sm' | 'md' }) {
  const { user, setShowAuthModal } = useAuth();
  const [fav, setFav] = useState(false);
  useEffect(() => { if (user) setFav(isFavorite(user, movie.id)); }, [user, movie.id]);
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { setShowAuthModal(true); return; }
    if (fav) { removeFavorite(user, movie.id); setFav(false); }
    else { addFavorite(user, { id: movie.id, title: movie.title, poster_path: movie.poster_path || '', vote_average: movie.vote_average, overview: movie.overview }); setFav(true); }
  };
  const s = size === 'sm' ? 'w-8 h-8 text-lg' : 'w-10 h-10 text-xl';
  return (
    <motion.button onClick={toggle} whileTap= scale: 0.8  whileHover= scale: 1.15 
      className={${s} flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/10 transition-colors ${fav ? 'text-danflix-red' : 'text-white/70 hover:text-white'}}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}>
      {fav ? 'u2665' : 'u2661'}
    </motion.button>
  );
}
