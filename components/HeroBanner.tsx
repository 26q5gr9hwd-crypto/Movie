'use client';
import{motion}from'framer-motion';
import Image from'next/image';
import Link from'next/link';
import{Movie}from'@/types/movie';
import{getImageUrl}from'@/lib/tmdb';
const F={opacity:0};const S={opacity:1};const t1={duration:0.6};
export default function HeroBanner({movie}:{movie:Movie}){
const bg=getImageUrl(movie.backdrop_path,'original');
const mid=movie['id'];const rt=movie['vote_average'];
return(<div className="relative w-full h-[85vh] overflow-hidden">
{bg&&<Image src={bg} alt={movie.title} fill className="object-cover" priority sizes="100vw"/>}
<div className="absolute inset-0 bg-gradient-to-t from-danflix-black via-danflix-black/60 to-transparent"/>
<div className="absolute bottom-0 left-0 px-8 pb-32 max-w-3xl z-10">
<motion.h1 className="font-heading text-6xl md:text-8xl text-white mb-4" initial={F} animate={S} transition={t1}>
{movie.title}</motion.h1>
<div className="flex gap-4 text-sm text-gray-400 mb-4">
{rt.toFixed(1)}
{movie.release_date?.slice(0,4)}</div>
<p className="text-gray-300 leading-relaxed line-clamp-3 mb-6">{movie.overview}</p>
<div className="flex gap-4">
<Link href={'/movie/'+mid} className="px-8 py-3 bg-danflix-red text-white font-heading text-xl rounded hover:bg-red-700 transition-colors">Watch Now</Link>
<Link href={'/movie/'+mid} className="px-8 py-3 bg-white/10 text-white font-heading text-xl rounded hover:bg-white/20 transition-colors">More Info</Link>
</div></div></div>);}
