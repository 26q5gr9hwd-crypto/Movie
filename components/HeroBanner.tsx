'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getImageUrl } from '@/lib/tmdb';

const F = { opacity: 0 };
const S = { opacity: 1 };
const iH = { opacity: 0, y: 30 };
const aH = { opacity: 1, y: 0 };
const iF = { opacity: 0, y: 20 };
const t1 = { duration: 0.6 };
const t3 = { delay: 0.3 };
const t4 = { delay: 0.4 };
const t5 = { delay: 0.5 };

export default function HeroBanner({ movie }: { movie: Movie }) {
  const bg = getImageUrl(movie.backdrop_path, 'original');
  const mid = movie['id'];
  const rt = movie['vote_average'];
  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {bg && <Image src={bg} alt={movie.title} fill className="object-cover" priority sizes="100vw" />}
      <div className="absolute inset-0 bg-gradient-to-t from-danflix-black via-danflix-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-danflix-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-8 pb-32 max-w-3xl z-10">
        <motion.h1 className="font-heading text-6xl md:text-8xl text-white leading-none mb-4" initial={iH} animate={aH} transition={t1}>
          {movie.title}
        </motion.h1>
        <motion.div className="flex items-center gap-4 mb-4" initial={F} animate={S} transition={t3}>
          <div className="text-danflix-gold font-bold text-lg">{rt.toFixed(1)} ★</div>
          <div className="text-gray-400 text-sm">{movie.release_date?.slice(0, 4)}</div>
        </motion.div>
        <motion.p className="text-gray-300 text-base leading-relaxed line-clamp-3 mb-6" initial={F} animate={S} transition={t4}>
          {movie.overview}
        </motion.p>
        <motion.div className="flex gap-4" initial={iF} animate={aH} transition={t5}>
          <Link href={'/movie/' + mid} className="px-8 py-3 bg-danflix-red text-white font-heading text-xl rounded hover:bg-red-700 transition-colors">
            Watch Now
          </Link>
          <Link href={'/movie/' + mid} className="px-8 py-3 bg-white/10 text-white font-heading text-xl rounded hover:bg-white/20 transition-colors backdrop-blur-sm">
            More Info
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
