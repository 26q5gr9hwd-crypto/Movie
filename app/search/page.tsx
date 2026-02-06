'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FavoriteButton from '@/components/FavoriteButton';

const TMDB = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w300';

interface Movie { id: number; title: string; poster_path: string; vote_average: number; overview: string; }

const fadeIn = { opacity: 0, y: 20 };
const fadeShow = { opacity: 1, y: 0 };
const stagger = (i: number) => ({ delay: i * 0.04 });

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [res, setRes] = useState<Movie[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!q.trim()) { setRes([]); return; }
    const t = setTimeout(async () => {
      setBusy(true);
      try {
        const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const r = await fetch(TMDB + '/search/movie?api_key=' + key + '&query=' + encodeURIComponent(q));
        const d = await r.json();
        setRes(d.results || []);
      } catch { setRes([]); }
      setBusy(false);
    }, 500);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <main className="min-h-screen pt-24 px-6 max-w-7xl mx-auto">
      <input type="text" placeholder="Search movies..." value={q} onChange={e => setQ(e.target.value)} autoFocus
        className="w-full bg-[#181818] border border-white/10 rounded-xl px-6 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#e50914] mb-8" />
      {busy && <p className="text-gray-400 text-center">Searching...</p>}
      {!busy && q && !res.length && <p className="text-gray-500 text-center">No results</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {res.filter(m => m.poster_path).map((m, i) => (
          <motion.div key={m.id} initial={fadeIn} animate={fadeShow} transition={stagger(i)}
            className="relative group rounded-lg overflow-hidden bg-[#181818]">
            <img src={IMG + m.poster_path} alt={m.title}
              className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition">
              <div className="flex items-center justify-between">
                <p className="text-sm truncate mr-2">{m.title}</p>
                <FavoriteButton movie={m} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
