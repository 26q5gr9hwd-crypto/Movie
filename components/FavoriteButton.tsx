'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './auth/AuthContext';
import { addFavorite, removeFavorite, isFavorite, FavoriteMovie } from '@/lib/favorites';

interface Props {
  movie: FavoriteMovie;
  size?: number;
}

export default function FavoriteButton({ movie, size = 24 }: Props) {
  const { user, setShowAuthModal } = useAuth();
  const [faved, setFaved] = useState(false);

  useEffect(() => {
    if (user) setFaved(isFavorite(user, movie.id));
    else setFaved(false);
  }, [user, movie.id]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { setShowAuthModal(true); return; }
    if (faved) { removeFavorite(user, movie.id); setFaved(false); }
    else { addFavorite(user, movie); setFaved(true); }
  };

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.2 }}
      className="p1"
      aria-label={faved ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={faved ? '#e50914' : 'none'} stroke={faved ? '#e50914' : 'white'} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </motion.button>
  );
}
