import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { UpdateWatchlistInput } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { rating, note, status }: UpdateWatchlistInput = await req.json();

  const [result]: any = await pool.query(
    `UPDATE watchlist
     SET rating = COALESCE(?, rating),
         note   = COALESCE(?, note),
         status = COALESCE(?, status)
     WHERE id = ? AND user_id = ?`,
    [rating, note, status, id, (session.user as any).id],
  );

  if (result.affectedRows === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [rows]: any = await pool.query("SELECT * FROM watchlist WHERE id = ?", [
    id,
  ]);
  return NextResponse.json(rows[0]);
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const [result]: any = await pool.query(
    "DELETE FROM watchlist WHERE id = ? AND user_id = ?",
    [id, (session.user as any).id],
  );

  if (result.affectedRows === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Removed from watchlist" });
}
