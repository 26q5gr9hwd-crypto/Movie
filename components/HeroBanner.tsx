"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { IMG, BACKDROP } from "@/lib/tmdb";

export default function HeroBanner({ movie }: { movie: Movie }) {
  const bg = movie.backdrop_path ? `${IMG}${BACKDROP}${movie.backdrop_path}` : "";
  const fadeIn = { opacity: 0, y: 30 };
  const visible = { opacity: 1, y: 0 };
  const dur = { duration: 0.8 };
  return (
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {bg && <Image src={bg} alt={movie.title} fill priority className="object-cover" sizes="100vw" />}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />
      <motion.div initial={fadeIn} animate={visible} transition={dur} className="absolute bottom-[15%] left-4 md:left-12 max-w-2xl z-10">
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white tracking-wider uppercase leading-none">{movie.title}</h1>
        <div className="flex items-center gap-3 mt-3">
          ★ {movie.vote_average.toFixed(1)}
          {movie.release_date && <span>{new Date(movie.release_date).getFullYear()}</span>}
        </div>
        <p className="text-gray-300 text-sm md:text-base mt-4 line-clamp-3">{movie.overview}</p>
        <div className="flex gap-3 mt-6">
          <Link href={`/movie/${movie.id}`} className="bg-danflix-red hover:bg-red-700 text-white px-6 py-3 rounded font-heading text-lg tracking-wider uppercase transition-colors">Watch Now</Link>
          <Link href={`/movie/${movie.id}`} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded font-heading text-lg tracking-wider uppercase transition-colors border border-white/10">More Info</Link>
        </div>
      </motion.div>
    </section>
  );
}
