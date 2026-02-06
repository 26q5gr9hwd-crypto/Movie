import Image from 'next/image';
import Link from 'next/link';
import { getMovieDetails, imgUrl } from '@/lib/tmdb';
export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetails(Number(id));
  return (
    <main className='min-h-screen bg-danflix-black'>
      <div className='relative h-[50vh] min-h-[400px] w-full overflow-hidden'>
        <Image src={imgUrl(movie.backdrop_path, 'original')} alt={movie.title} fill priority className='object-cover' />
        <div className='absolute inset-0 bg-gradient-to-t from-danflix-black via-danflix-black/60 to-transparent' />
      </div>
      <div className='relative z-10 -mt-32 mx-auto max-w-6xl px-4 md:px-8'>
        <div className='flex flex-col md:flex-row gap-8'>
          <div className='flex-shrink-0 w-[250px] mx-auto md:mx-0'>
            <Image src={imgUrl(movie.poster_path)} alt={movie.title} width={250} height={375} className='rounded-lg shadow-2xl' />
          </div>
          <div className='flex-1'>
            <h1 className='font-heading text-4xl md:text-5xl font-bold text-white mb-2'>{movie.title}</h1>
            {movie.tagline && <p className='text-danflix-gold italic mb-4'>{movie.tagline}</p>}
            <div className='flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-400'>
              {movie.vote_average.toFixed(1)}
              {movie.release_date?.slice(0, 4)}
              {movie.runtime && {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m}
            </div>
            <div className='flex flex-wrap gap-2 mb-4'>{movie.genres?.map(g => {g.name})}</div>
            <p className='text-gray-300 text-lg leading-relaxed mb-8'>{movie.overview}</p>
            <div className='rounded-xl bg-white/5 p-8 mb-8 text-center text-gray-400'>Player will be available here</div>
            {movie.credits?.cast?.length > 0 && <div><h2 className='font-heading text-2xl font-bold text-white mb-4'>Cast</h2><div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>{movie.credits.cast.slice(0, 10).map(p => <div key={p.id} className='flex-shrink-0 w-24 text-center'><Image src={imgUrl(p.profile_path, 'w185')} alt={p.name} width={96} height={144} className='rounded-lg object-cover mb-1' /><p className='text-xs text-white line-clamp-1'>{p.name}</p><p className='text-xs text-gray-500 line-clamp-1'>{p.character}</p></div>)}</div></div>}
          </div>
        </div>
        <div className='mt-8 pb-12'><Link href='/' className='text-danflix-red hover:text-red-400 transition-colors'>Back to Home</Link></div>
      </div>
    </main>
  );
}
