"use client";
import { useState } from "react";

type Props = { onSearch: (query: string) => void };

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5
                   text-sm text-white placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium
                   text-white hover:bg-indigo-700 transition-colors"
      >
        Search
      </button>
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            onSearch("action");
          }}
          className="rounded-xl border border-gray-700 px-4 py-2.5 text-sm
                     text-gray-400 hover:bg-gray-800 transition-colors"
        >
          Clear
        </button>
      )}
    </form>
  );
}
