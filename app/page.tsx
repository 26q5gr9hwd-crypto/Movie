import { getTrending, getPopular, getTopRated, getUpcoming } from '@/lib/tmdb';
import HeroBanner from '@/components/HeroBanner';
import MovieCarousel from '@/components/MovieCarousel';
export default async function Home() {
  const [trending, popular, topRated, upcoming] = await Promise.all([getTrending(), getPopular(), getTopRated(), getUpcoming()]);
  const hero = trending[Math.floor(Math.random() * Math.min(5, trending.length))];
  return (
    <main className='min-h-screen bg-danflix-black'>
      {hero && <HeroBanner movie={hero} />}
      <div className='-mt-20 relative z-10'>
        <MovieCarousel title='Trending Now' movies={trending} />
        <MovieCarousel title='Popular' movies={popular} />
        <MovieCarousel title='Top Rated' movies={topRated} />
        <MovieCarousel title='Upcoming' movies={upcoming} />
      </div>
    </main>
  );
}
