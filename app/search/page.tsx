'use client';
import { useState, useEffect, useCallback } from 'react';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/search?q=' + encodeURIComponent(q));
      const data = await res.json();
      setResults(data.results || []); setSearched(true);
    } catch { setResults([]); }
    setLoading(false);
  }, []);
  useEffect(() => { const t = setTimeout(() => search(query), 400); return () => clearTimeout(t); }, [query, search]);
  return (
    <main className="min-h-screen bg-danflix-black pt-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto mb-8">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies..." autoFocus
          className="w-full bg-[#222] border border-white/10 rounded-lg px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-danflix-red text-lg" />
      </div>
      {loading && <p className="text-center text-gray-500">Searching...</p>}
      {!loading && searched && results.length === 0 && <p className="text-center text-gray-500">No results found</p>}
      {!loading && results.length > 0 && <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {results.map(m => <MovieCard key={m['id']} movie={m} />)}
      </div>}
      {!loading && !searched && <p className="text-center text-gray-600 mt-20 font-heading text-2xl tracking-wider">Type to search movies</p>}
    </main>
  );
}
