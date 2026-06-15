// app/api/search/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "the";

  try {
    const [p1, p2, p3] = await Promise.all([
      fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&page=1&apikey=${process.env.OMDB_API_KEY}`,
      ).then((r) => r.json()),
      fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&page=2&apikey=${process.env.OMDB_API_KEY}`,
      ).then((r) => r.json()),
      fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&page=3&apikey=${process.env.OMDB_API_KEY}`,
      ).then((r) => r.json()),
      fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&page=4&apikey=${process.env.OMDB_API_KEY}`,
      ).then((r) => r.json()),
    ]);

    const results = [
      ...(p1.Search ?? []),
      ...(p2.Search ?? []),
      ...(p3.Search ?? []),
    ];

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
