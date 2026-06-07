import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import prisma from "@/lib/prisma"
import BoutonDeconnexion from "../composants/boutondeco"
import BoutonSuppression from "../composants/boutonsuppression"
import AvatarEditable from "../composants/avatareditabel"
import GraphiqueActivite from "../composants/graphiqueactivite"

export default async function PageCompte() {
    const session = await getServerSession()

    if (!session?.user?.email) {
        redirect("/auth")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            pseudo: true,
            email: true,
            image: true,
            inscritLe: true,
            _count: {
                select: {
                    votes: true,
                    depense: true,
                }
            }
        }
    })

    const initiale = (user?.pseudo || user?.email || "?")[0].toUpperCase()

    const dateInscription = user?.inscritLe
        ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
            .format(new Date(user.inscritLe))
        : null

    const nbVotes = user?._count?.votes ?? 0
    const nbDepenses = user?._count?.depense ?? 0

    const maintenant = new Date()
    const debut12Mois = new Date(maintenant)
    debut12Mois.setMonth(debut12Mois.getMonth() - 11)
    debut12Mois.setDate(1)
    debut12Mois.setHours(0, 0, 0, 0)

    const depensesBrutes = await prisma.depense.findMany({
        where: {
            user: { email: session.user.email },
            creerLe: { gte: debut12Mois },
        },
        select: {
            prix: true,
            creerLe: true,
        },
    })

    const totauxParCle: Record<string, number> = {}
    for (const d of depensesBrutes) {
        const cle = `${d.creerLe.getFullYear()}-${d.creerLe.getMonth()}`
        totauxParCle[cle] = (totauxParCle[cle] ?? 0) + Number(d.prix)
    }

    const nomsMois = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "aoû", "sep", "oct", "nov", "déc"]
    const donneesGraphique = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(maintenant)
        d.setMonth(d.getMonth() - (11 - i))
        const cle = `${d.getFullYear()}-${d.getMonth()}`
        return {
            mois: nomsMois[d.getMonth()],
            valeur: Math.round(totauxParCle[cle] ?? 0),
        }
    })

    const totalAnnuel = depensesBrutes.reduce((acc, d) => acc + Number(d.prix), 0)

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-200 flex flex-col">

            {/* Header — pleine largeur */}
           <header className="border-b border-white/[0.05] py-4 sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-md w-full">
    <div className="w-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
            <h1 className="text-xl font-extrabold tracking-tight text-[#CA3C66] leading-none">
                Mon compte
            </h1>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-0.5">
            <span className="text-[10px] uppercase tracking-[2px] text-zinc-600">total craqué</span>
            <span className="text-lg font-bold text-[#CA3C66]">
                {totalAnnuel.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] text-zinc-700">sur 12 mois</span>
        </div>
    </div>
</header>

            <main className="flex-1 w-full px-8 py-10 flex flex-col gap-6">

                {/* Hero profil */}
                <div className="relative flex items-center gap-6 p-6 rounded-2xl bg-[#111111] border border-white/[0.06] overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(circle at 90% 50%, rgba(202,60,102,0.06) 0%, transparent 60%)" }}
                    />
                    <AvatarEditable initiale={initiale} imageActuelle={user?.image ?? null} />
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold text-white leading-tight truncate">
                            {user?.pseudo || "membre du caniveau"}
                        </h2>
                        <p className="text-[11px] text-[#A7E0E0] uppercase tracking-[3px] mt-1">
                            membre du tribunal
                        </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end shrink-0 gap-0.5">
                        <span className="text-[10px] uppercase tracking-[2px] text-zinc-600">membre depuis</span>
                        <span className="text-sm font-bold text-white">{dateInscription ?? "—"}</span>
                    </div>
                </div>

                {/* Grille principale 3 colonnes — pleine largeur */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* ── Colonne 1 : informations ── */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden">
                            <div className="px-5 py-3 border-b border-white/[0.05]">
                                <p className="text-[10px] uppercase tracking-[2.5px] text-zinc-600 font-semibold">informations</p>
                            </div>

                            <div className="px-5 py-4 flex items-center gap-3 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center shrink-0">
                                    <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] uppercase tracking-[2px] text-zinc-600 font-semibold">pseudo</p>
                                    <p className="text-sm text-zinc-200 font-medium mt-0.5 truncate">{user?.pseudo || "—"}</p>
                                </div>
                                <svg className="w-3 h-3 text-zinc-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>

                            <div className="px-5 py-4 flex items-center gap-3 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center shrink-0">
                                    <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] uppercase tracking-[2px] text-zinc-600 font-semibold">email</p>
                                    <p className="text-sm text-zinc-200 font-medium mt-0.5 truncate">{user?.email}</p>
                                </div>
                                <svg className="w-3 h-3 text-zinc-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>

                            <div className="px-5 py-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center shrink-0">
                                    <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] uppercase tracking-[2px] text-zinc-600 font-semibold">mot de passe</p>
                                    <p className="text-sm text-zinc-700 tracking-widest mt-0.5 select-none">••••••••••</p>
                                </div>
                                <svg className="w-3 h-3 text-zinc-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        <BoutonDeconnexion />
                    </div>

                    {/* ── Colonne 2 : stats + graphique ── */}
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
                                <div className="w-7 h-7 rounded-lg bg-[#CA3C66]/10 flex items-center justify-center mb-3">
                                    <svg className="w-3.5 h-3.5 text-[#CA3C66]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-white">{nbVotes}</p>
                                <p className="text-[9px] uppercase tracking-[2px] text-zinc-600 font-semibold mt-1">affaires traitées</p>
                            </div>

                            <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                                    <svg className="w-3.5 h-3.5 text-amber-500/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-white">{nbDepenses}</p>
                                <p className="text-[9px] uppercase tracking-[2px] text-zinc-600 font-semibold mt-1">dossiers soumis</p>
                            </div>
                        </div>

                        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden flex-1">
                            <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
                                <p className="text-[10px] uppercase tracking-[2.5px] text-zinc-600 font-semibold">dépenses / mois</p>
                                <span className="text-[10px] text-zinc-700">12 mois</span>
                            </div>
                            <GraphiqueActivite donnees={donneesGraphique} />
                        </div>
                    </div>

                    {/* ── Colonne 3 : zone dangereuse ── */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-[#111111] border border-red-500/20 rounded-2xl overflow-hidden flex-1">
                            <div className="px-5 py-3 border-b border-red-500/10 flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-red-500/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="text-[10px] uppercase tracking-[2.5px] text-red-500/50 font-semibold">zone dangereuse</p>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <div>
                                    <p className="text-sm text-zinc-300 font-semibold">Supprimer mon compte</p>
                                    <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                                        Action irréversible — tous tes votes et dépenses seront définitivement effacés.
                                    </p>
                                </div>
                                <BoutonSuppression />
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="border-t border-white/[0.04] py-5 mt-4">
                <div className="w-full px-8 text-center">
                    <p className="text-zinc-700 text-xs">
                        &copy; {new Date().getFullYear()} Zéro Pointé — aucun droit réservé.
                    </p>
                </div>
            </footer>

        </div>
    )
}