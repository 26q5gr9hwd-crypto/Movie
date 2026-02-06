'use client';
import { useState, useCallback } from 'react';
import { KinoboxPlayer, type KinoboxPlayerData } from './KinoboxPlayer';
import { SSPoiskPlayer } from './SSPoiskPlayer';

interface Props {
  movieId: string;
  mediaType?: 'film' | 'series';
}

interface PlayerOption {
  key: string;
  name: string;
  source: 'kinobox' | 'sspoisk';
  iframeUrl?: string;
}

export function PlayerWrapper({ movieId, mediaType = 'film' }: Props) {
  const [failed, setFailed] = useState(false);
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [sel, setSel] = useState<PlayerOption | null>(null);
  const [open, setOpen] = useState(false);

  const onLoaded = useCallback((list: KinoboxPlayerData[]) => {
    const opts: PlayerOption[] = [
      ...list.map(p => ({ key: p.key, name: p.name, source: 'kinobox' as const, iframeUrl: p.iframeUrl })),
      { key: 'SSPOISK', name: 'SSPoisk', source: 'sspoisk' as const },
    ];
    setPlayers(opts);
    setSel(opts[0]);
  }, []);

  const onErr = useCallback(() => {
    setFailed(true);
    const fb: PlayerOption = { key: 'SSPOISK', name: 'SSPoisk', source: 'sspoisk' };
    setPlayers([fb]);
    setSel(fb);
  }, []);

  return (
    <div className="space-y-3">
      {players.length > 1 && (
        <div className="flex justify-center relative">
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 text-sm hover:bg-white/10 transition-all">
            &#9654;
            {sel?.name || 'Player'}
            &#9660;
          </button>
          {open && (
            <div className="absolute top-full mt-1 bg-zinc-900 border border-white/10 rounded-lg p-1 min-w-[200px] shadow-xl z-20">
              {players.map(p => (
                <button key={p.key} onClick={() => { setSel(p); setOpen(false); }}
                  className={'w-full text-left px-3 py-2 rounded text-sm transition-colors ' + (sel?.key === p.key ? 'bg-red-500/20 text-red-400' : 'text-white/70 hover:bg-white/5')}>
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {sel?.source === 'sspoisk' || failed ? (
        <SSPoiskPlayer movieId={movieId} type={mediaType} />
      ) : (
        <KinoboxPlayer movieId={movieId} onPlayersLoaded={onLoaded} onError={onErr}
          selectedPlayer={sel?.iframeUrl ? { key: sel.key, name: sel.name, iframeUrl: sel.iframeUrl } : undefined} />
      )}
    </div>
  );
}
