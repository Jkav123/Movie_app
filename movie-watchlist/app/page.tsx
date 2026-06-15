"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OMDbSearchResult } from "@/lib/types";
import MovieCard from "./Components/MovieCard";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [movies, setMovies] = useState<OMDbSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not signed in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Load default movies on mount
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/search?q=action")
      .then((r) => r.json())
      .then(setMovies)
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">🎬 Movie Watchlist</h1>
          <p className="text-sm text-gray-400">
            Welcome back, {session?.user?.name?.split(" ")[0]} 👋
          </p>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="/watchlist"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            My Watchlist
          </a>
          <a
            href="/api/auth/signout"
            className="rounded-xl border border-gray-700 px-4 py-2
                                                  text-sm text-gray-400 hover:bg-gray-800 transition-colors"
          >
            Sign Out
          </a>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-8 py-10">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Popular Movies
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-xl bg-gray-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((m) => (
              <MovieCard key={m.imdbID} movie={m} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
