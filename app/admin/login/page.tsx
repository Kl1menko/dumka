"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f3]">
      <div className="w-full max-w-sm">
        <p className="mb-2 font-serif text-2xl tracking-widest uppercase text-[#111]">Dumka</p>
        <p className="mb-10 text-xs uppercase tracking-widest text-[#111]/40">Вхід в адмін панель</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-[#111]/50">
              Ел. пошта
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-[#111]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#111]/40"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-[#111]/50">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-[#111]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#111]/40"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#111] py-3 text-xs uppercase tracking-widest text-white transition hover:bg-[#333] disabled:opacity-50"
          >
            {loading ? "Входимо…" : "Увійти"}
          </button>
        </form>
      </div>
    </div>
  );
}
