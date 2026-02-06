export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}
export interface Genre { id: number; name: string; }
export interface Cast { id: number; name: string; character: string; profile_path: string | null; order: number; }
export interface VideoResult { key: string; site: string; type: string; name: string; }
export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  tagline: string | null;
  status: string;
  budget: number;
  revenue: number;
  credits: { cast: Cast[] };
  videos: { results: VideoResult[] };
}
export interface TMDBResponse { page: number; results: Movie[]; total_pages: number; total_results: number; }
