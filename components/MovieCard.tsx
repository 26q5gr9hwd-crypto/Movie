"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { IMG, POSTER } from "@/lib/tmdb";

export default function MovieCard({ movie, index = 0 }: { movie: Movie; index?: number }) {
const src = movie.poster_path ? ${IMG}${POSTER}${movie.poster_path} : "";
  if (!src) return null;
  const initAnim = { opacity: 0, y: 20 };
  const showAnim = { opacity: 1, y: 0 };
  const trans = { delay: index * 0.05, duration: 0.4 };
  const vp = { once: true };
  const hover = { scale: 1.05 };
  return (
    <motion.div initial={initAnim} whileInView={showAnim} transition={trans} viewport={vp}>
      <Link href={/movie/${movie.id}} className="group block w-[160px] sm:w-[200px] flex-shrink-0">
        <motion.div whileHover={hover} className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <Image src={src} alt={movie.title} fill sizes="200px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
            <p className="text-sm font-medium truncate">{movie.title}</p>
            ★ {movie.vote_average.toFixed(1)}
          </div>
          <div className="absolute inset-0 rounded-lg ring-1 ring-white/0 group-hover:ring-danflix-gold/40 group-hover:shadow-[0_0_15px_rgba(196,167,71,0.15)] transition-all" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
