'use client';
import { useState, useEffect, useCallback } from 'react';
import KinoboxPlayer from './KinoboxPlayer';
import SSPoiskPlayer from './SSPoiskPlayer';

interface Props { movieId: string; type?: 'film' | 'series'; }

export default function PlayerWrapper({ movieId, type = 'film' }: Props) {
  const [player, setPlayer] = useState<'kinobox'|'sspoisk'|'failed'>('kinobox');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (player !== 'kinobox' || loaded) return;
    const t = setTimeout(() => setPlayer('sspoisk'), 5000);
    return () => clearTimeout(t);
  }, [player, movieId, loaded]);

  const onKbErr = useCallback(() => setPlayer('sspoisk'), []);
  const onKbLoad = useCallback(() => setLoaded(true), []);
  const onSsErr = useCallback(() => setPlayer('failed'), []);

  if (player === 'failed') return (
    <div className="flex flex-col items-center justify-center w-full aspect-video bg-black/30 rounded-xl border border-white/10">
      <p className="text-white/50 text-sm mb-3">Player unavailable</p>
      <button onClick={() => { setPlayer('kinobox'); setLoaded(false); }}
        className="px-4 py-2 text-xs text-white/70 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
        Try again</button>
    </div>);

  return (<div className="w-full">
    <div className="flex items-center gap-2 mb-3">
      <button onClick={() => { setPlayer('kinobox'); setLoaded(false); }}
        className={'px-3 py-1.5 rounded-lg text-xs font-medium transition-all ' + (player === 'kinobox' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20')}>
        Kinobox</button>
      <button onClick={() => setPlayer('sspoisk')}
        className={'px-3 py-1.5 rounded-lg text-xs font-medium transition-all ' + (player === 'sspoisk' ? 'bg-red-600 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20')}>
        SSPoisk</button>
    </div>
    {player === 'kinobox' && <KinoboxPlayer movieId={movieId} onError={onKbErr} onLoad={onKbLoad} />}
    {player === 'sspoisk' && <SSPoiskPlayer movieId={movieId} type={type} onError={onSsErr} />}
  </div>);
}