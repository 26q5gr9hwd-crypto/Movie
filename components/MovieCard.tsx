'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { imgUrl } from '@/lib/tmdb';
const fadeUp = { opacity: 0, y: 20 };
const show = { opacity: 1, y: 0 };
const hover = { scale: 1.05 };
const spring = { type: 'spring' as const, stiffness: 300, damping: 20 };
export default function MovieCard({ movie, index = 0 }: { movie: Movie; index?: number }) {
  const vp = { once: true };
  const tr = { delay: index * 0.05, duration: 0.4 };
  return (
    <motion.div initial={fadeUp} whileInView={show} viewport={vp} transition={tr}>
      <Link href={/movie/${movie.id}} className='group relative block w-[180px] flex-shrink-0'>
        <motion.div whileHover={hover} transition={spring} className='relative aspect-[2/3] overflow-hidden rounded-lg'>
          <Image src={imgUrl(movie.poster_path)} alt={movie.title} fill sizes='180px' className='object-cover transition-all duration-300 group-hover:brightness-110' />
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
          <div className='absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
            <p className='text-sm font-semibold text-white line-clamp-2'>{movie.title}</p>
            <div className='mt-1 flex items-center gap-1'>
              {movie.vote_average.toFixed(1)}
              {movie.release_date?.slice(0, 4)}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
