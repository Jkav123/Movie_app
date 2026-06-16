"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { WatchlistEntry } from "@/lib/types";
import Link from "next/link";
import StarRating from "../Components/StarRating";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "want_to_watch", label: "🕐 Want to Watch" },
  { value: "watching", label: "▶️ Watching" },
  { value: "watched", label: "✅ Watched" },
];

export default function WatchlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [status]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const filtered = filter
    ? entries.filter((e) => e.status === filter)
    : entries;

  return (
    <main className="min-h-screen bg-gray-950">
      <header
        className="border-b border-gray-800 bg-gray-900 px-8 py-5
                          flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
          <p className="text-sm text-gray-400">{entries.length} movies saved</p>
        </div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Browse movies
        </Link>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 px-8 py-10">
        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors
                ${
                  filter === f.value
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-800 py-16 text-center">
            <p className="text-gray-500">No movies here yet.</p>
            <Link
              href="/"
              className="mt-2 inline-block text-sm text-indigo-400 hover:underline"
            >
              Browse movies →
            </Link>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="flex gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-4"
            >
              <Link href={`/movie/${e.imdb_id}`}>
                {e.poster_url ? (
                  <img
                    src={e.poster_url}
                    alt={e.title}
                    className="h-32 w-22 shrink-0 rounded-lg object-cover
                               hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div
                    className="flex h-32 w-20 shrink-0 items-center justify-center
                                  rounded-lg bg-gray-800 text-2xl"
                  >
                    🎬
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <Link
                  href={`/movie/${e.imdb_id}`}
                  className="truncate font-semibold text-white
                             hover:text-indigo-400 transition-colors"
                >
                  {e.title}
                </Link>
                <p className="text-xs text-gray-500">{e.release_year}</p>
                <StarRating value={e.rating ?? 0} readonly />
                {e.note && (
                  <p className="text-xs text-gray-400 italic line-clamp-2">
                    "{e.note}"
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">
                    {e.status.replace(/_/g, " ")}
                  </span>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-xs text-red-500 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
