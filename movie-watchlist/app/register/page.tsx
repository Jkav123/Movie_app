"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="">
        <h1 className="">Create account 🎬</h1>
        <p className="">Start tracking your movies</p>

        {error && <p className="">{error}</p>}

        <form onSubmit={handleSubmit} className="">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className=""
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className=""
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            className=""
          />
          <button type="submit" disabled={loading} className="">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="">
          Already have an account?{" "}
          <Link href="/login" className="">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
