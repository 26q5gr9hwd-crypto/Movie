export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-8xl tracking-wider text-white mb-4">
          DAN<span className="text-[#e50914]">FLIX</span>
        </h1>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#e50914] to-[#c4a747] rounded-full mb-8" />
        <p className="text-xl text-gray-400 font-body tracking-wide">
          Coming Soon
        </p>
        <p className="mt-4 text-sm text-gray-600">
          A fresh cinema experience built with Next.js
        </p>
      </div>
    </main>
  );
}
