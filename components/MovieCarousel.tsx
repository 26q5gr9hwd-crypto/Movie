"use client";
import { useRef } from "react";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

export default function MovieCarousel({ title, movies }: { title: string; movies: Movie[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.75, behavior: "smooth" });
  const noScroll = { scrollbarWidth: "none" as const };
  return (
    <section className="relative py-6 px-4 md:px-12">
      <h2 className="font-heading text-2xl md:text-3xl text-white mb-4 tracking-wide uppercase">{title}</h2>
      <div className="group relative">
        <button onClick={() => scroll(-1)} className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-[#0a0a0a] to-transparent items-center justify-center hidden group-hover:flex">
          ‹
        </button>
        <div ref={ref} className="flex gap-3 overflow-x-auto scroll-smooth pb-2" style={noScroll}>
          {movies.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </div>
        <button onClick={() => scroll(1)} className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-[#0a0a0a] to-transparent items-center justify-center hidden group-hover:flex">
          ›
        </button>
      </div>
    </section>
  );
}
