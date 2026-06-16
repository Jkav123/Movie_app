import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { CreateCommentInput } from "@/lib/types";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const { imdb_id, body, parent_id }: CreateCommentInput = await req.json();

    if (!body?.trim()) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 },
      );
    }

    const [result]: any = await pool.query(
      `INSERT INTO comments (user_id, imdb_id, parent_id, body)
       VALUES (?, ?, ?, ?)`,
      [(session.user as any).id, imdb_id, parent_id ?? null, body.trim()],
    );

    const [rows]: any = await pool.query(
      `SELECT comments.*, users.name AS author_name
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.id = ?`,
      [result.insertId],
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 },
    );
  }
}
