'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './auth/AuthContext';
import { addFavorite, removeFavorite, isFavorite, FavoriteMovie } from '@/lib/favorites';

interface Props {
  movie: { id: number; title: string; poster_path: string; vote_average: number; overview: string };
  size?: 'sm' | 'md';
}

export default function FavoriteButton({ movie, size = 'md' }: Props) {
  const { user } = useAuth();
  const [fav, setFav] = useState(false);
  useEffect(() => { if (user) setFav(isFavorite(user, movie.id)); }, [user, movie.id]);
  if (!user) return null;

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (fav) { removeFavorite(user, movie.id); }
    else { addFavorite(user, { id: movie.id, title: movie.title, poster_path: movie.poster_path, vote_average: movie.vote_average, overview: movie.overview }); }
    setFav(!fav);
  };

  const s = size === 'sm';
  const tapAnim = { scale: 0.8 };
  const pulse = fav ? { scale: [1, 1.3, 1] } : {};
  const dur = { duration: 0.3 };
  const cls = (s ? 'w-4 h-4' : 'w-5 h-5') + ' ' + (fav ? 'text-danflix-red fill-danflix-red' : 'text-white fill-none');

  return (
    <motion.button whileTap={tapAnim} onClick={toggle} className={(s ? 'w-8 h-8' : 'w-10 h-10') + ' flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-colors'}>
      <motion.svg animate={pulse} transition={dur} className={cls} viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
      </motion.svg>
    </motion.button>
  );
}
