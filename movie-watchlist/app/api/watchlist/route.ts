import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const [rows]: any = await pool.query(
    "SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC",
    [(session.user as any).id],
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { imdb_id, title, poster_url, overview, release_year } =
    await req.json();

  const [existing]: any = await pool.query(
    "SELECT id FROM watchlist WHERE user_id = ? AND imdb_id = ?",
    [(session.user as any).id, imdb_id],
  );

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Already in watchlist" },
      { status: 409 },
    );
  }

  const [result]: any = await pool.query(
    `INSERT INTO watchlist (user_id, imdb_id, title, poster_url, overview, release_year)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      (session.user as any).id,
      imdb_id,
      title,
      poster_url,
      overview,
      release_year,
    ],
  );

  const [rows]: any = await pool.query("SELECT * FROM watchlist WHERE id = ?", [
    result.insertId,
  ]);
  return NextResponse.json(rows[0], { status: 201 });
}
