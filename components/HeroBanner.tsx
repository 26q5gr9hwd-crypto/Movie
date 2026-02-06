'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { imgUrl } from '@/lib/tmdb';
const fadeIn = { opacity: 0, y: 30 };
const show = { opacity: 1, y: 0 };
const slow = { duration: 0.8, ease: 'easeOut' as const };
export default function HeroBanner({ movie }: { movie: Movie }) {
  return (
    <section className='relative h-[70vh] min-h-[500px] w-full overflow-hidden'>
      <Image src={imgUrl(movie.backdrop_path, 'original')} alt={movie.title} fill priority className='object-cover' />
      <div className='absolute inset-0 bg-gradient-to-t from-danflix-black via-danflix-black/60 to-transparent' />
      <div className='absolute inset-0 bg-gradient-to-r from-danflix-black/80 to-transparent' />
      <motion.div initial={fadeIn} animate={show} transition={slow} className='absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-3xl'>
        <h1 className='font-heading text-5xl md:text-7xl font-bold text-white mb-4 leading-tight'>{movie.title}</h1>
        <div className='flex items-center gap-3 mb-4'>
          {movie.vote_average.toFixed(1)}
          {movie.release_date?.slice(0, 4)}
        </div>
        <p className='text-gray-300 text-lg line-clamp-3 mb-6'>{movie.overview}</p>
        <div className='flex gap-3'>
          <Link href={/movie/${movie.id}} className='rounded-md bg-danflix-red px-8 py-3 font-semibold text-white transition-colors hover:bg-red-700'>Watch Now</Link>
          <Link href={/movie/${movie.id}} className='rounded-md bg-white/20 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30'>More Info</Link>
        </div>
      </motion.div>
    </section>
  );
}
