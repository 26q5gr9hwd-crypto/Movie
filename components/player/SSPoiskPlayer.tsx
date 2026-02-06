'use client';

import { useState, useCallback } from 'react';

interface SSPoiskPlayerProps {
  movieId: string;
  onError?: () => void;
  onLoad?: () => void;
}

export default function SSPoiskPlayer({ movieId, onError, onLoad }: SSPoiskPlayerProps) {
  const [loading, setLoading] = useState(true);

  const isShiki = movieId.startsWith('shiki');
  const type = isShiki ? 'series' : 'film';
  const cleanId = isShiki ? movieId.replace('shiki', '') : movieId;

  const src = `https://www.sspoisk.ru/${type}/${cleanId}/`;

  const handleLoad = useCallback(() => {
    setLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setLoading(false);
    onError?.();
  }, [onError]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        title="SSPoisk Player"
      />
    </div>
  );
}