import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

type Params = { params: Promise<{ imdbId: string }> };

export async function GET(_: Request, { params }: Params) {
  const { imdbId } = await params;
  try {
    const [rows]: any = await pool.query(
      `SELECT 
        comments.id,
        comments.user_id,
        comments.imdb_id,
        comments.parent_id,
        comments.body,
        comments.created_at,
        users.name AS author_name
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.imdb_id = ?
       ORDER BY comments.created_at ASC`,
      [imdbId],
    );
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { imdbId: id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const [result]: any = await pool.query(
      "DELETE FROM comments WHERE id = ? AND user_id = ?",
      [id, (session.user as any).id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Comment not found or not yours" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Comment deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
