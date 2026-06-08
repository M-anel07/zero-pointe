// app/auth/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { inscriptionUser } from "@/app/actions/auth"; // Import de ton action
import BoutonRetour from "../composants/boutonretour";

export default function PageAuth() {
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData) as Record<string, string>;

    if (mode === "inscription") {
      // 1. On crée le compte via ta Server Action
      const res = await inscriptionUser(formData);

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      // 2. Puis on connecte automatiquement l'utilisateur
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Compte créé mais la connexion automatique a échoué. Essaie de te connecter.",
        );
        setLoading(false);
        return;
      }
    } else {
      // Connexion directe via NextAuth
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }
    }

    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans flex flex-col text-slate-200 w-full">
      {/* Header — CHANGÉ : w-full px-8 au lieu de max-w-7xl mx-auto px-6 */}
      <header className="border-b border-white/15 py-5 sticky top-0 z-10 bg-[#080808]/95 backdrop-blur-md w-full">
        <div className="flex items-center gap-5">
          <BoutonRetour />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#CA3C66] leading-none">
              Zéro Pointé
            </h1>
            <p className="text-[11px] text-[#A7E0E0] mt-1 tracking-wide uppercase">
              Le tribunal de la honte
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="flex bg-[#161616] border border-white/8 rounded-xl p-1 mb-8">
            {(["connexion", "inscription"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                  mode === m
                    ? "bg-[#CA3C66] text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {m === "connexion" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "inscription" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#A7E0E0] font-semibold">
                  Pseudo
                </label>
                <input
                  name="pseudo"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="ton_pseudo"
                  className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#CA3C66]/60 transition"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-[#A7E0E0] font-semibold">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="toi@exemple.fr"
                className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#CA3C66]/60 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-[#A7E0E0] font-semibold">
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete={
                  mode === "inscription" ? "new-password" : "current-password"
                }
                placeholder="••••••••"
                className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#CA3C66]/60 transition"
              />
            </div>

            {error && (
              <p className="text-xs text-[#ED93B1] bg-[#CA3C66]/10 border border-[#CA3C66]/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#CA3C66] hover:bg-[#b8335a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider py-3 rounded-xl transition-colors"
            >
              {loading
                ? "..."
                : mode === "connexion"
                  ? "Se connecter"
                  : "S'inscrire"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-600">
            {mode === "connexion"
              ? "Pas encore de compte ?"
              : "Déjà un compte ?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "connexion" ? "inscription" : "connexion");
                setError(null);
              }}
              className="text-[#A7E0E0] hover:text-white transition font-semibold"
            >
              {mode === "connexion" ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </main>

      {/* Footer — CHANGÉ : Supprimé max-w-7xl mx-auto px-6 pour occuper toute la largeur */}
      <footer className="bg-[#111111] border-t border-white/8 py-6 w-full px-8">
        <div className="text-center">
          <p className="text-zinc-500 text-xs">
            &copy; {new Date().getFullYear()} Zéro Pointé. Aucun droit réservé,
            contrôlez vos finances.
          </p>
        </div>
      </footer>
    </div>
  );
}
