'use client';
import { useState } from 'react';

interface Props {
  movieId: string;
  type?: 'film' | 'series';
}

const HOST = ['www','sspoisk','ru'].join('.');

export function SSPoiskPlayer({ movieId, type = 'film' }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cleanId = movieId.replace(/^shiki/, '');
  const src = 'https' + '://' + HOST + '/' + type + '/' + cleanId + '/';

  if (error) return (
    <div className="flex items-center justify-center h-[400px] bg-black/50 rounded-xl">
      <p className="text-white/60 text-sm">Player unavailable</p>
    </div>
  );

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <iframe src={src} className="w-full h-full border-0" allowFullScreen
        onLoad={() => setLoading(false)} onError={() => setError(true)} />
    </div>
  );
}
