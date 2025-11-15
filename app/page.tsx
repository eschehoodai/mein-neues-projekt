export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-pulse">
          Hallo Welt
        </h1>
        <p className="text-xl md:text-2xl text-pink-200 font-light">
          Mein erstes Next.js 16 Projekt ist LIVE!
        </p>
        <div className="mt-8">
          <div className="inline-block animate-bounce">
            <span className="text-6xl">⚔️</span>
          </div>
        </div>
      </div>
    </main>
  );
}