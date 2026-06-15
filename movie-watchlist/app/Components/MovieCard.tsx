import Link from "next/link";
import { OMDbSearchResult } from "@/lib/types";

type Props = { movie: OMDbSearchResult };

export default function MovieCard({ movie }: Props) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <Link
      href={`/movie/${movie.imdbID}`}
      className="group overflow-hidden rounded-xl border border-gray-800
                 bg-gray-900 transition-transform hover:-translate-y-1
                 hover:border-indigo-500"
    >
      {hasPoster ? (
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="h-64 w-full object-cover"
        />
      ) : (
        <div className="flex h-64 items-center justify-center bg-gray-800 text-4xl">
          🎬
        </div>
      )}
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-white">
          {movie.Title}
        </p>
        <p className="text-xs text-gray-500">{movie.Year}</p>
      </div>
    </Link>
  );
}
