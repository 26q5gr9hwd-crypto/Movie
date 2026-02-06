'use client';
import { useState, useEffect, useCallback } from 'react';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/search?q=' + encodeURIComponent(q));
      const data = await res.json();
      setResults(data.results || []);
    } catch { setResults([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 400);
    return () => clearTimeout(t);
  }, [query, search]);

  return (
    <main className="min-h-screen bg-danflix-black pt-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-8">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" placeholder="Search movies..." value={query} onChange={e => setQuery(e.target.value)} autoFocus
            className="w-full bg-[#222] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-danflix-red text-lg"/>
        </div>
        {loading && <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-danflix-red border-t-transparent rounded-full animate-spin"/></div>}
        {!loading && query && results.length === 0 && <p className="text-center text-gray-500 py-12 text-lg">No movies found</p>}
        {!loading && !query && <p className="text-center text-gray-500 py-12 text-lg">Start typing to search movies</p>}
        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map(m => <MovieCard key={m.id} movie={m}/>)}
          </div>
        )}
      </div>
    </main>
  );
}
