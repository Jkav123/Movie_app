"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { OMDbSearchResult } from "@/lib/types";
import MovieCard from "./Components/MovieCard";
import SearchBar from "./Components/SearchBar";
import GenreFilter from "./Components/GenreFilter";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [movies, setMovies] = useState<OMDbSearchResult[]>([]);
  const [query, setQuery] = useState("marvel");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setMovies(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    if (status === "authenticated") fetchMovies();
  }, [status, fetchMovies]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <header
        className="border-b border-gray-800 bg-gray-900 px-8 py-5
                          flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">🎬 OMDBS</h1>
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
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-xl border border-gray-700 px-4 py-2 text-sm
                      text-gray-400 hover:bg-gray-800 transition-colors"
          >
            Sign Out
          </button>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-8 py-10">
        <SearchBar onSearch={(q) => setQuery(q)} />
        <GenreFilter selected={query} onSelect={(q) => setQuery(q)} />

        <h2 className="text-xl font-semibold text-white">
          {query === "marvel" ? "Popular Movies" : `Results for "${query}"`}
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
        ) : movies.length === 0 ? (
          <p className="py-16 text-center text-gray-500">No movies found.</p>
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
