'use client';
import { useState, useEffect } from 'react';

export interface KinoboxPlayerData {
  key: string;
  name: string;
  iframeUrl: string;
}

interface Props {
  movieId: string;
  onPlayersLoaded?: (players: KinoboxPlayerData[]) => void;
  onError?: () => void;
  selectedPlayer?: KinoboxPlayerData | null;
}

const API_HOST = ['api','kinobox','tv'].join('.');

export function KinoboxPlayer({ movieId, onPlayersLoaded, onError, selectedPlayer }: Props) {
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [players, setPlayers] = useState<KinoboxPlayerData[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const go = async () => {
      try {
        const id = movieId.replace(/^shiki/, '');
        const url = 'https' + '://' + API_HOST + '/api/players?kinopoisk=' + id;
        const r = await fetch(url);
        if (!r.ok) throw new Error('fail');
        const d = await r.json();
        const arr = (Array.isArray(d) ? d : d?.data || [])
          .filter((p: any) => p?.iframeUrl && p?.type)
          .map((p: any) => ({ key: p.type.toUpperCase(), name: p.type, iframeUrl: p.iframeUrl }));
        if (!arr.length) throw new Error('empty');
        setPlayers(arr);
        onPlayersLoaded?.(arr);
      } catch {
        setError(true);
        onError?.();
      } finally {
        setLoading(false);
      }
    };
    go();
  }, [movieId]);

  const active = selectedPlayer || players[0];

  if (loading) return (
    <div className="flex items-center justify-center h-[400px] bg-black/50 rounded-xl">
      <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !active) return null;

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      {iframeLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <iframe src={active.iframeUrl} className="w-full h-full border-0" allowFullScreen
        onLoad={() => setIframeLoading(false)} />
    </div>
  );
}
