import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import BoutonDeconnexion from "../composants/boutondeco"

export default async function PageCompte() {
  const session = await getServerSession();

    if (!session) {
        redirect("/auth")
    }

    const initiale = (session.user?.name || session.user?.email || "?")[0].toUpperCase()

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-slate-200 flex flex-col">

            {/* Header */}
            <header className="bg-[#111111] border-b border-white/8 py-5 sticky top-0 z-10">
                <div className="w-full px-8 flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour
                    </Link>
                    <div className="w-px h-5 bg-white/10" />
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#CA3C66] leading-none">
                        Mon Compte
                    </h1>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-sm flex flex-col gap-4">

                    {/* Avatar + nom */}
                    <div className="flex flex-col items-center gap-3 pb-2">
                        <div className="w-16 h-16 rounded-2xl bg-[#CA3C66]/20 border border-[#CA3C66]/30 flex items-center justify-center">
                            <span className="text-2xl font-black text-[#CA3C66]">{initiale}</span>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-bold text-lg leading-tight">
                                {session.user?.name || "Membre du Caniveau"}
                            </p>
                            <p className="text-[11px] text-[#A7E0E0] uppercase tracking-widest mt-0.5">
                                Membre du tribunal
                            </p>
                        </div>
                    </div>

                    {/* Infos */}
                    <div className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden">

                        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Pseudo</p>
                                <p className="text-sm text-white font-medium mt-0.5">
                                    {session.user?.name || "—"}
                                </p>
                            </div>
                            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>

                        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Email</p>
                                <p className="text-sm text-white font-medium mt-0.5">
                                    {session.user?.email}
                                </p>
                            </div>
                            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <div className="px-5 py-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Mot de passe</p>
                                <p className="text-sm text-zinc-600 tracking-widest mt-0.5 select-none">••••••••••••</p>
                            </div>
                            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>

                    </div>

                    {/* Actions */}
                    <BoutonDeconnexion />

                </div>
            </main>

            <footer className="mt-auto bg-[#111111] border-t border-white/8 py-6">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-zinc-500 text-xs">
                        &copy; {new Date().getFullYear()} Zéro Pointé. Aucun droit réservé, contrôlez vos finances.
                    </p>
                </div>
            </footer>

        </div>
    )
}
