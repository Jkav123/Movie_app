export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900 px-8 py-5">
        <h1 className="text-2xl font-bold text-white">🎬 Movie Watchlist</h1>
        <p className="text-sm text-gray-400">
          Discover and track movies you love
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-8 py-10">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Popular Movies
        </h2>
        <p className="text-gray-400">Movies will load here soon...</p>
      </div>
    </main>
  );
}
