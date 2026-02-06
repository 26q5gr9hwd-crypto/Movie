'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getImageUrl } from '@/lib/tmdb';

const hoverScale = { scale: 1.05 };
const dur = { duration: 0.2 };

export default function MovieCard({ movie }: { movie: Movie }) {
  const img = getImageUrl(movie.poster_path);
  if (!img) return null;
  return (
    <Link href={'/movie/' + movie.id}>
      <motion.div
        className="relative flex-shrink-0 w-[180px] rounded-lg overflow-hidden cursor-pointer group"
        whileHover={hoverScale}
        transition={dur}
      >
        <div className="aspect-[2/3] relative">
          <Image src={img} alt={movie.title} fill className="object-cover" sizes="180px" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div>
            <p className="font-heading text-sm text-white leading-tight">{movie.title}</p>
            <p className="text-xs text-danflix-gold mt-1">{movie.vote_average.toFixed(1)} ★</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
