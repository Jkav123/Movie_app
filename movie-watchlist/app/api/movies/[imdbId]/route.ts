import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ imdbId: string }> },
) {
  const { imdbId } = await params;
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=${process.env.OMDB_API_KEY}`,
    );
    const data = await res.json();

    if (data.Response === "False") {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 },
    );
  }
}
