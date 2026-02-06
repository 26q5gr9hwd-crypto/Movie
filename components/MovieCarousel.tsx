'use client';
import { useRef, useState } from 'react';
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';
export default function MovieCarousel({ title, movies }: { title: string; movies: Movie[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setL] = useState(false);
  const [canR, setR] = useState(true);
  const check = () => { if (!ref.current) return; setL(ref.current.scrollLeft > 0); setR(ref.current.scrollLeft < ref.current.scrollWidth - ref.current.clientWidth - 10); };
  const scroll = (d: 'l' | 'r') => { if (!ref.current) return; ref.current.scrollBy({ left: d === 'l' ? -600 : 600, behavior: 'smooth' }); setTimeout(check, 400); };
  return (
    <section className='relative py-6'>
      <h2 className='mb-4 font-heading text-2xl font-bold text-white px-4 md:px-8'>{title}</h2>
      <div className='group relative'>
        {canL && <button onClick={() => scroll('l')} className='absolute left-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-r from-danflix-black to-transparent opacity-0 transition-opacity group-hover:opacity-100'>‹</button>}
        <div ref={ref} onScroll={check} className='flex gap-3 overflow-x-auto px-4 md:px-8 scrollbar-hide scroll-smooth snap-x'>
          {movies.map((m, i) => <div key={m.id} className='snap-start'><MovieCard movie={m} index={i} /></div>)}
        </div>
        {canR && <button onClick={() => scroll('r')} className='absolute right-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-l from-danflix-black to-transparent opacity-0 transition-opacity group-hover:opacity-100'>›</button>}
      </div>
    </section>
  );
}
