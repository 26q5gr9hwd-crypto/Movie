'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getImageUrl } from '@/lib/tmdb';

const fadeIn = { opacity: 0, y: 30 };
const fadeShow = { opacity: 1, y: 0 };
const fadeOpts = { duration: 0.8 };

export default function HeroBanner({ movie }: { movie: Movie }) {
  const bg = getImageUrl(movie.backdrop_path, 'original');
  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {bg && <Image src={bg} alt={movie.title} fill className="object-cover" priority />}
      <div className="absolute inset-0 bg-gradient-to-t from-danflix-black via-danflix-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-danflix-black/80 to-transparent" />
      <motion.div className="absolute bottom-20 left-8 max-w-2xl" initial={fadeIn} animate={fadeShow} transition={fadeOpts}>
        <h1 className="font-heading text-6xl md:text-7xl text-white mb-4">{movie.title}</h1>
        <p className="text-gray-300 text-lg line-clamp-3 mb-6">{movie.overview}</p>
        <div className="flex gap-4">
          <Link href={'/movie/' + movie.id} className="bg-danflix-red hover:bg-red-700 text-white px-8 py-3 rounded font-bold transition-colors">Watch Now</Link>
          <Link href={'/movie/' + movie.id} className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded font-bold backdrop-blur transition-colors">More Info</Link>
        </div>
        <p className="text-danflix-gold mt-4 text-sm">{movie.vote_average.toFixed(1)} / 10 ★</p>
      </motion.div>
    </div>
  );
}
