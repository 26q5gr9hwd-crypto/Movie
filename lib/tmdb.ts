import { Movie, MovieDetails, TMDBResponse } from "@/types/movie";

const BASE_URL = "https:" + "//api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const sp = new URLSearchParams({ api_key: API_KEY, ...params });
  const res = await fetch(${BASE_URL}${endpoint}?${sp}, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(TMDB error: ${res.status});
  return res.json();
}

export const getTrending = () => fetchTMDB<TMDBResponse>("/trending/movie/week").then(d => d.results);
export const getPopular = () => fetchTMDB<TMDBResponse>("/movie/popular").then(d => d.results);
export const getTopRated = () => fetchTMDB<TMDBResponse>("/movie/top_rated").then(d => d.results);
export const getUpcoming = () => fetchTMDB<TMDBResponse>("/movie/upcoming").then(d => d.results);
export const searchMovies = (q: string) => fetchTMDB<TMDBResponse>("/search/movie", { query: q }).then(d => d.results);
export const getMovieDetails = (id: number) => fetchTMDB<MovieDetails>(/movie/${id}, { append_to_response: "credits,videos" });

export const IMG = "https:" + "//image.tmdb.org/t/p/";
export const POSTER = "w500";
export const BACKDROP = "original";
