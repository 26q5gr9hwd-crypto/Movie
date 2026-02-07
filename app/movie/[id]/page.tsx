import { getMovieDetails, IMG, BACKDROP, POSTER } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";

export default async function MoviePage({params}:{params:Promise<{id:string}>}) {
  const {id} = await params;
  const m = await getMovieDetails(Number(id));
  const bg = m.backdrop_path ? `${IMG}${BACKDROP}${m.backdrop_path}` : "";
const poster = m.poster_path ? `${IMG}${POSTER}${m.poster_path}` : "";
  return (
    <main className="min-h-screen">
      <div className="relative h-[50vh]">
        {bg&&<Image src={bg} alt="" fill className="object-cover" sizes="100vw"/>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"/>
        <Link href="/" className="absolute top-6 left-6 z-20 text-white/70 hover:text-white">Back</Link>
      </div>
      <div className="relative z-10 -mt-32 px-4 md:px-12 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {poster&&<Image src={poster} alt={m.title} width={260} height={390} className="rounded-lg shadow-2xl flex-shrink-0 mx-auto md:mx-0"/>}
        <div className="flex-1">
          <h1 className="font-heading text-4xl md:text-6xl text-white tracking-wider uppercase">{m.title}</h1>
          {m.tagline&&<p className="text-danflix-gold italic mt-2">{m.tagline}</p>}
          <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-400">
            ★ {m.vote_average.toFixed(1)}
            {m.release_date?.slice(0,4)}
            {m.runtime>0&&<span>{Math.floor(m.runtime/60)}h {m.runtime%60}m</span>}
            {m.genres?.map((g,i) => g.name).join(', ')}
          </div>
          <p className="text-gray-300 mt-4 leading-relaxed">{m.overview}</p>
          <div id="player-mount" className="mt-6 aspect-video bg-danflix-dark rounded-lg border border-white/5"/>
        </div>
      </div>
    </main>
  );
}
