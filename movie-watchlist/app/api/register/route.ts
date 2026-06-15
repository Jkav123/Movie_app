import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const [existing]: any = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const hash = await bcrypt.hash(password, 12);
    const [result]: any = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
      [email, hash, name],
    );

    return NextResponse.json(
      { id: result.insertId, email, name },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
