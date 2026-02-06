import { getMovieDetails, getImageUrl } from '@/lib/tmdb';
import Image from 'next/image';

const noScroll = { scrollbarWidth: 'none' as const };

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await getMovieDetails(Number(id));
  const bg = getImageUrl(m.backdrop_path, 'original');
  const poster = getImageUrl(m.poster_path);
  return (
    <main className="bg-danflix-black min-h-screen">
      <div className="relative h-[60vh]">
        {bg && <Image src={bg} alt={m.title} fill className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-danflix-black via-danflix-black/60 to-transparent" />
      </div>
      <div className="-mt-40 relative z-10 px-8 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {poster && <div className="w-[250px] flex-shrink-0 rounded-lg overflow-hidden shadow-2xl"><Image src={poster} alt={m.title} width={250} height={375} /></div>}
        <div>
          <h1 className="font-heading text-5xl text-white mb-2">{m.title}</h1>
          {m.tagline && <p className="text-danflix-gold italic mb-4">{m.tagline}</p>}
          <div className="flex gap-4 text-gray-400 text-sm mb-4">
            <p>{m.release_date ? m.release_date.slice(0, 4) : ''}</p>
            <p>{m.runtime} min</p>
            <p className="text-danflix-gold">{m.vote_average.toFixed(1)} ★</p>
          </div>
          <div className="flex gap-2 mb-6 flex-wrap">{m.genres.map(g => <p key={g.id} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">{g.name}</p>)}</div>
          <p className="text-gray-300 leading-relaxed mb-8 max-w-2xl">{m.overview}</p>
          <h2 className="font-heading text-2xl text-white mb-4">Cast</h2>
          <div className="flex gap-3 overflow-x-auto pb-4" style={noScroll}>
            {m.credits.cast.slice(0, 8).map(c => {
              const img = getImageUrl(c.profile_path, 'w185');
              return <div key={c.id} className="flex-shrink-0 w-20 text-center">
                {img && <Image src={img} alt={c.name} width={80} height={80} className="rounded-full mx-auto mb-1" />}
                <p className="text-white text-xs">{c.name}</p>
              </div>;
            })}
          </div>
          <div className="mt-8 p-6 bg-danflix-dark rounded-lg"><p className="text-gray-500">Player coming soon</p></div>
        </div>
      </div>
    </main>
  );
}
