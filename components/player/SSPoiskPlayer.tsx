'use client';
import { useState } from 'react';

interface Props { movieId: string; type?: 'film' | 'series'; onError?: () => void; onLoad?: () => void; }

export default function SSPoiskPlayer({ movieId, type = 'film', onError, onLoad }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const id = movieId.replace(/^shiki/, '');
  const t = movieId.startsWith('shiki') ? 'series' : type;
  const h = ['www','sspoisk','ru'].join('.');
  const src = 'https://' + h + '/' + t + '/' + id + '/';

  if (error) return (
    <div className="flex items-center justify-center w-full aspect-video bg-black/30 rounded-xl">
      <p className="text-white/50 text-sm">Player unavailable</p>
    </div>);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
      <iframe src={src} className="absolute inset-0 w-full h-full border-0"
        allowFullScreen allow="autoplay; fullscreen"
        onLoad={() => { setLoading(false); onLoad?.(); }}
        onError={() => { setError(true); onError?.(); }} />
      {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/80">
        <div className="w-8 h-8 border-2 border-red-500/80 border-t-transparent rounded-full animate-spin" /></div>}
    </div>);
}