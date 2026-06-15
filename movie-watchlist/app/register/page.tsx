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
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8">
        <h1 className="mb-1 text-2xl font-bold text-white">
          Create account 🎬
        </h1>
        <p className="mb-6 text-sm text-gray-400">Start tracking your movies</p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-900/40 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5
                       text-sm text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5
                       text-sm text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5
                       text-sm text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold
                       text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
