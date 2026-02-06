'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';

const initAnim = { opacity: 0, y: 20 };
const showAnim = { opacity: 1, y: 0 };
const viewOpts = { once: true };
const noScroll = { scrollbarWidth: 'none' as const };

export default function MovieCarousel({ title, movies }: { title: string; movies: Movie[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => { if (ref.current) ref.current.scrollBy({ left: d  600, behavior: 'smooth' }); };
  return (
    <section className="mb-10">
      <h2 className="font-heading text-2xl text-white mb-4 px-8">{title}</h2>
      <div className="relative group">
        <button onClick={() => scroll(-1)} className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-danflix-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-2xl">{String.fromCharCode(8249)}</button>
        <div ref={ref} className="flex gap-3 overflow-x-auto px-8 scroll-smooth snap-x" style={noScroll}>
          {movies.map((m, i) => {
            const trans = { delay: i  0.05 };
            return (
              <motion.div key={m.id} className="snap-start" initial={initAnim} whileInView={showAnim} transition={trans} viewport={viewOpts}>
                <MovieCard movie={m} />
              </motion.div>
            );
          })}
        </div>
        <button onClick={() => scroll(1)} className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-danflix-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-2xl">{String.fromCharCode(8250)}</button>
      </div>
    </section>
  );
}
