"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@school.test");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciais inválidas.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edf4ee] p-6">
      <div className="w-full max-w-md rounded-3xl border border-[#dfe7df] bg-white p-8 shadow-[0_20px_45px_rgba(21,39,31,0.08)]">
        <div className="mb-7">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#39755d] text-xl font-bold text-white">
            A
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a7e74]">Admin portal</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.06em] text-[#1d2b29]">Entrar</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#53645b]">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="w-full rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-[#39755d]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#53645b]">Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              className="w-full rounded-xl border border-[#ccd9ce] bg-[#f9fbf9] px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-[#39755d]"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-[#f2c6c6] bg-[#fdf1f1] px-3 py-2 text-sm font-medium text-[#8b3a3a]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#39755d] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#2f654f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "A entrar..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
