export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* VIDEO HINTERGRUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Ihr Browser unterstützt kein Video.
      </video>

      {/* DUNKLER OVERLAY */}
      <div className="fixed inset-0 bg-black opacity-50 z-10"></div>

      {/* INHALT */}
      <main className="relative z-20 min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-pulse drop-shadow-2xl">
            Hallo Welt
          </h1>
          <p className="text-xl md:text-2xl text-cyan-300 font-light drop-shadow-lg">
            mein-neues-projekt mit Video-Hintergrund!
          </p>
          <div className="mt-8">
            <div className="inline-block animate-bounce">
              <span className="text-6xl">⚔️</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}