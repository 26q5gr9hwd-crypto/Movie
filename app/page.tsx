import { getTrending, getPopular, getTopRated, getUpcoming } from '@/lib/tmdb';
import HeroBanner from '@/components/HeroBanner';
import MovieCarousel from '@/components/MovieCarousel';

export default async function Home() {
  const [trending, popular, topRated, upcoming] = await Promise.all([
    getTrending(), getPopular(), getTopRated(), getUpcoming()
  ]);
  const hero = trending.results[Math.floor(Math.random() * Math.min(5, trending.results.length))];
  return (
    <main className="bg-danflix-black min-h-screen">
      <HeroBanner movie={hero} />
      <div className="-mt-20 relative z-10">
        <MovieCarousel title="Trending Now" movies={trending.results} />
        <MovieCarousel title="Popular" movies={popular.results} />
        <MovieCarousel title="Top Rated" movies={topRated.results} />
        <MovieCarousel title="Coming Soon" movies={upcoming.results} />
      </div>
    </main>
  );
}
