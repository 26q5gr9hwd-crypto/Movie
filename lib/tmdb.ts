import { MovieDetails, TMDBResponse } from '@/types/movie';

const K = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const _H = 'api.themoviedb';
const BASE = https://${_H}.org/3;
const _I = 'image.tmdb';

export const getImageUrl = (path: string | null, size = 'w500') =>
  path ? https://${_I}.org/t/p/${size}${path} : '';

async function f<T>(ep: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(${BASE}${ep});
  url.searchParams.set('api_key', K);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(TMDB ${res.status});
  return res.json();
}

export const getTrending = () => f<TMDBResponse>('/trending/movie/week');
export const getPopular = () => f<TMDBResponse>('/movie/popular');
export const getTopRated = () => f<TMDBResponse>('/movie/top_rated');
export const getUpcoming = () => f<TMDBResponse>('/movie/upcoming');
export const searchMovies = (q: string) => f<TMDBResponse>('/search/movie', { query: q });
export const getMovieDetails = (id: number) =>
  f<MovieDetails>(/movie/${id}, { append_to_response: 'credits,videos' });
