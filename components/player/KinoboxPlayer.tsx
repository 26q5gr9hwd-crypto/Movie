'use client';
import { useState, useEffect } from 'react';

interface Props { movieId: string; onError?: () => void; onLoad?: () => void; }
interface Src { key: string; name: string; url: string; }

export default function KinoboxPlayer({ movieId, onError, onLoad }: Props) {
  const [loading, setLoading] = useState(true);
  const [srcs, setSrcs] = useState<Src[]>([]);
  const [cur, setCur] = useState<Src | null>(null);

  useEffect(() => {
    const id = movieId.replace(/^shiki/, '');
    const h = ['api','kinobox','tv'].join('.');
    fetch('https://' + h + '/api/players?kinopoisk=' + id)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const arr = (Array.isArray(d) ? d : d?.data || [])
          .filter((p: any) => p?.iframeUrl && p?.type)
          .map((p: any) => ({ key: p.type, name: p.type, url: p.iframeUrl }));
        if (!arr.length) throw 0;
        setSrcs(arr); setCur(arr[0]);
      })
      .catch(() => onError?.());
  }, [movieId, onError]);

  if (!cur) return loading ? (
    <div className="flex items-center justify-center w-full aspect-video bg-black/50 rounded-xl">
      <div className="w-8 h-8 border-2 border-red-500/80 border-t-transparent rounded-full animate-spin" />
    </div>
  ) : null;

  return (<div className="w-full">
    {srcs.length > 1 && <div className="flex gap-2 mb-3 flex-wrap">{srcs.map(s => (
      <button key={s.key} onClick={() => { setCur(s); setLoading(true); }}
        className={'px-3 py-1.5 rounded-lg text-sm font-medium transition-all ' + (cur.key === s.key ? 'bg-red-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20')}>
        {s.name}</button>))}</div>}
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
      <iframe src={cur.url} className="absolute inset-0 w-full h-full border-0"
        allowFullScreen allow="autoplay; fullscreen"
        onLoad={() => { setLoading(false); onLoad?.(); }}
        onError={() => onError?.()} />
      {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/80">
        <div className="w-8 h-8 border-2 border-red-500/80 border-t-transparent rounded-full animate-spin" /></div>}
    </div>
  </div>);
}