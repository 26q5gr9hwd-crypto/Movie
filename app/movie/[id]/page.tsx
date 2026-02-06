import { PlayerWrapper } from '@/components/player/PlayerWrapper';

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-6">Movie {id}</h1>
        <PlayerWrapper movieId={id} />
      </div>
    </main>
  );
}
