// app/historique/page.tsx
import prisma from '@/lib/prisma'
import Link from 'next/link'
import FiltresHistorique from '../composants/filtreshistorique'

const CATEGORIES = ['Shopping', 'Restaurant', 'Beauté', 'Tech', 'Food', 'Jeux', 'Autre']

const CATEGORY_COLORS: Record<string, string> = {
    Shopping: 'bg-pink-950/60 text-pink-300',
    Restaurant: 'bg-orange-950/60 text-orange-300',
    Beauté: 'bg-rose-950/60 text-rose-300',
    Tech: 'bg-blue-950/60 text-blue-300',
    Food: 'bg-amber-950/60 text-amber-300',
    Jeux: 'bg-cyan-950/60 text-cyan-300',
    Autre: 'bg-violet-950/60 text-violet-300',
}

interface PageProps {
    searchParams: Promise<{ categorie?: string; tri?: string }>
}

async function getDepenses(categorie?: string, tri?: string) {
    const orderBy = tri === 'prix_asc' ? { prix: 'asc' as const }
        : tri === 'prix_desc' ? { prix: 'desc' as const }
            : { creerLe: 'desc' as const } // défaut : plus récent en premier

    return await prisma.depense.findMany({
        where: categorie ? { category: categorie } : undefined,
        orderBy,
    })
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
}

export default async function PageHistorique({ searchParams }: PageProps) {
    const { categorie, tri } = await searchParams
    const depenses = await getDepenses(categorie, tri)

    const total = depenses.reduce((acc, d) => acc + d.prix, 0)
    const count = depenses.length

    return (
        <div className="min-h-screen bg-[#0d0d0d] font-sans flex flex-col">

            <header className="bg-[#111111] border-b border-white/8 py-5 sticky top-0 z-10 w-full">
                <div className="w-full px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Retour
                        </Link>
                        <div className="w-px h-5 bg-white/10" />
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[#CA3C66] leading-none">
                                Historique complet
                            </h1>
                            <p className="text-[11px] text-[#A7E0E0] mt-0.5">
                                {total.toFixed(2)} € au total
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.1em] text-[#A7E0E0] font-semibold">
                            Dépenses affichées
                        </p>
                        <p className="text-xl font-bold text-white leading-tight">
                            {count}
                        </p>
                    </div>
                </div>
            </header>

            <div className="w-full px-8 py-8 flex flex-col gap-6">
                <FiltresHistorique
                    categories={CATEGORIES}
                    categorieActive={categorie}
                    triActif={tri}
                />

                {depenses.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-zinc-600 text-sm border border-dashed border-white/8 rounded-2xl">
                        Aucune dépense pour cette sélection.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {depenses.map((depense) => (
                            <div
                                key={depense.id}
                                className="bg-[#161616] border border-white/8 rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="shrink-0 w-1 h-10 rounded-full bg-[#CA3C66]/60" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white/90 truncate">
                                            {depense.titre}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span
                                                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[depense.category] ?? 'bg-zinc-800 text-zinc-400'}`}
                                            >
                                                {depense.category}
                                            </span>
                                            <span className="text-[10px] text-zinc-500">
                                                {formatDate(depense.creerLe)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-[#ED93B1] whitespace-nowrap shrink-0">
                                    {depense.prix.toFixed(2)} €
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}