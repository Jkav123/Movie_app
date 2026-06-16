"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { OMDbMovie, WatchlistEntry, UpdateWatchlistInput } from "@/lib/types";
import StarRating from "@/app/Components/StarRating";
import Link from "next/link";
import CommentSection from "@/app/Components/CommentSection";

export default function MoviePage() {
  const { imdbId } = useParams<{ imdbId: string }>();
  const { status } = useSession();
  const router = useRouter();
  const [movie, setMovie] = useState<OMDbMovie | null>(null);
  const [entry, setEntry] = useState<WatchlistEntry | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Load movie detail and check if already in watchlist
  useEffect(() => {
    if (status !== "authenticated") return;

    fetch(`/api/movies/${imdbId}`)
      .then((r) => r.json())
      .then(setMovie);

    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((data: WatchlistEntry[]) => {
        const found = data.find((e) => e.imdb_id === imdbId);
        if (found) {
          setEntry(found);
        }
      });
  }, [imdbId, status]);

  const addToWatchlist = async () => {
    if (!movie) return;
    setSaving(true);
    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imdb_id: movie.imdbID,
        title: movie.Title,
        poster_url: movie.Poster !== "N/A" ? movie.Poster : null,
        overview: movie.Plot,
        release_year: movie.Year?.slice(0, 4),
      }),
    });
    if (res.ok) setEntry(await res.json());
    setSaving(false);
  };

  const removeFromWatchlist = async () => {
    if (!entry) return;
    setSaving(true);
    await fetch(`/api/watchlist/${entry.id}`, { method: "DELETE" });
    setEntry(null);
    setNote("");
    setSaving(false);
  };

  const updateEntry = async (data: UpdateWatchlistInput) => {
    if (!entry) return;
    const res = await fetch(`/api/watchlist/${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated: WatchlistEntry = await res.json();
      setEntry(updated);
    }
  };

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const hasPoster = movie.Poster && movie.Poster !== "N/A";
  const genres = movie.Genre?.split(", ") ?? [];

  return (
    <main className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900 px-8 py-4">
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back to movies
        </Link>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-8 py-10">
        {/* Movie info */}
        <div className="flex gap-6">
          {hasPoster ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="h-64 w-44 shrink-0 rounded-xl object-cover shadow-lg"
            />
          ) : (
            <div
              className="flex h-64 w-44 shrink-0 items-center justify-center
                            rounded-xl bg-gray-800 text-4xl"
            >
              🎬
            </div>
          )}

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">{movie.Title}</h1>

            <div className="flex flex-wrap gap-2 text-sm text-gray-400">
              <span>{movie.Year}</span>
              {movie.Runtime !== "N/A" && <span>· {movie.Runtime}</span>}
              {movie.Rated !== "N/A" && <span>· {movie.Rated}</span>}
              {movie.imdbRating !== "N/A" && (
                <span className="text-yellow-400">
                  · ★ {movie.imdbRating} IMDb
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-gray-700 px-3 py-0.5
                             text-xs text-gray-300"
                >
                  {g}
                </span>
              ))}
            </div>

            {movie.Director !== "N/A" && (
              <p className="text-sm text-gray-400">
                <span className="text-gray-500">Directed by </span>
                {movie.Director}
              </p>
            )}

            <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
              {movie.Plot}
            </p>
          </div>
        </div>

        {/* Watchlist panel */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white text-lg">My Watchlist</h2>
            {entry ? (
              <button
                onClick={removeFromWatchlist}
                disabled={saving}
                className="rounded-xl border border-red-800 px-4 py-2 text-sm
                           text-red-400 hover:bg-red-900/30 disabled:opacity-50 transition-colors"
              >
                Remove from Watchlist
              </button>
            ) : (
              <button
                onClick={addToWatchlist}
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium
                           text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                + Add to Watchlist
              </button>
            )}
          </div>

          {entry && (
            <>
              {/* Status */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Watch Status
                </p>
                <select
                  value={entry.status}
                  onChange={(e) =>
                    updateEntry({
                      status: e.target.value as WatchlistEntry["status"],
                    })
                  }
                  className="rounded-xl border border-gray-700 bg-gray-800 px-3 py-2
                             text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="want_to_watch">🕐 Want to Watch</option>
                  <option value="watching">▶️ Watching</option>
                  <option value="watched">✅ Watched</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  My Rating
                </p>
                <div className="flex items-center gap-4">
                  <StarRating
                    value={entry.rating ?? 0}
                    onChange={(v) =>
                      updateEntry({ rating: v === 0 ? null : v })
                    }
                  />
                  {entry.rating && (
                    <button
                      onClick={() => updateEntry({ rating: null })}
                      className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                    >
                      Remove rating
                    </button>
                  )}
                </div>
              </div>

              {/* Note */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  My Note
                </p>
              </div>
            </>
          )}

          {!entry && (
            <p className="text-sm text-gray-500">
              Add this movie to your watchlist to rate it and leave a note.
            </p>
          )}
        </div>
        <CommentSection imdbId={imdbId} />
      </div>
    </main>
  );
}
