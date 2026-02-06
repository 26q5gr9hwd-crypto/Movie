'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getImageUrl } from '@/lib/tmdb';

const fade = { opacity: 0 };
const show = { opacity: 1 };

export default function HeroBanner({ movie }: { movie: Movie }) {
  const bg = getImageUrl(movie.backdrop_path, 'original');
  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {bg && <Image src={bg} alt={movie.title} fill className="object-cover" priority sizes="100vw" />}
      <div className="absolute inset-0 bg-gradient-to-t from-danflix-black via-danflix-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-danflix-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-8 pb-32 max-w-3xl">
        <motion.h1 className="font-heading text-6xl md:text-8xl text-white leading-none mb-4" initial= ...fade, y: 30  animate= ...show, y: 0  transition= duration: 0.6 >
          {movie.title}
        </motion.h1>
        <motion.div className="flex items-center gap-4 mb-4" initial={fade} animate={show} transition= delay: 0.3 >
          {movie.vote_average.toFixed(1)} ★
          {movie.release_date?.slice(0, 4)}
        </motion.div>
        <motion.p className="text-gray-300 text-base leading-relaxed line-clamp-3 mb-6" initial={fade} animate={show} transition= delay: 0.4 >
          {movie.overview}
        </motion.p>
        <motion.div className="flex gap-4" initial= ...fade, y: 20  animate= ...show, y: 0  transition= delay: 0.5 >
          <Link href={'/movie/' + movie.id} className="px-8 py-3 bg-danflix-red text-white font-heading text-xl rounded hover:bg-red-700 transition-colors">Watch Now</Link>
          <Link href={'/movie/' + movie.id} className="px-8 py-3 bg-white/10 text-white font-heading text-xl rounded hover:bg-white/20 transition-colors backdrop-blur-sm">More Info</Link>
        </motion.div>
      </div>
    </div>
  );
}
