"use client";

const GENRES = [
  { label: "All", query: "marvel" },
  { label: "Action", query: "action" },
  { label: "Comedy", query: "comedy" },
  { label: "Horror", query: "horror" },
  { label: "Sci-Fi", query: "science fiction" },
  { label: "Romance", query: "romance" },
  { label: "Thriller", query: "thriller" },
  { label: "Drama", query: "drama" },
];

type Props = { selected: string; onSelect: (query: string) => void };

export default function GenreFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((genre) => (
        <button
          key={genre.label}
          onClick={() => onSelect(genre.query)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors
            ${
              selected === genre.query
                ? "bg-indigo-600 text-white"
                : "border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
            }`}
        >
          {genre.label}
        </button>
      ))}
    </div>
  );
}
