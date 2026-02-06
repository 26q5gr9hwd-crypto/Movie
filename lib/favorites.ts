const FAV_KEY = 'danflix_favorites';

export interface FavoriteMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

function getStore(): Record<string, FavoriteMovie[]> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(FAV_KEY);
  return raw ? JSON.parse(raw) : {};
}

function save(store: Record<string, FavoriteMovie[]>) {
  localStorage.setItem(FAV_KEY, JSON.stringify(store));
}

export function addFavorite(userId: string, movie: FavoriteMovie) {
  const s = getStore();
  if (!s[userId]) s[userId] = [];
  if (!s[userId].find(m => m.id === movie.id)) { s[userId].push(movie); save(s); }
}

export function removeFavorite(userId: string, movieId: number) {
  const s = getStore();
  if (s[userId]) { s[userId] = s[userId].filter(m => m.id !== movieId); save(s); }
}

export function getFavorites(userId: string): FavoriteMovie[] {
  return getStore()[userId] || [];
}

export function isFavorite(userId: string, movieId: number): boolean {
  return (getStore()[userId] || []).some(m => m.id === movieId);
}
