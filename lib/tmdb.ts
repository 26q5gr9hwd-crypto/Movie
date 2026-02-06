import { MovieDetails, TMDBResponse } from '@/types/movie';
const KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';
async function tmdbFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(${BASE}${path});
  url.searchParams.set('api_key', KEY || '');
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}
export const getTrending = async () => (await tmdbFetch<TMDBResponse>('/trending/movie/week')).results;
export const getPopular = async () => (await tmdbFetch<TMDBResponse>('/movie/popular')).results;
export const getTopRated = async () => (await tmdbFetch<TMDBResponse>('/movie/top_rated')).results;
export const getUpcoming = async () => (await tmdbFetch<TMDBResponse>('/movie/upcoming')).results;
export const searchMovies = async (q: string) => (await tmdbFetch<TMDBResponse>('/search/movie', { query: q })).results;
export const getMovieDetails = (id: number) => tmdbFetch<MovieDetails>(/movie/${id}, { append_to_response: 'credits,videos' });
export const imgUrl = (path: string | null, size = 'w500') => path ? https://image.tmdb.org/t/p/${size}${path} : '/no-poster.svg';
