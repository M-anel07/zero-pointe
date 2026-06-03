// app/historique/page.tsx
import prisma from '@/lib/prisma'
import Link from 'next/link'
import FiltresHistorique from '../composants/FiltresHistorique'

const CATEGORIES = ['Shopping', 'Restaurant', 'Loisirs', 'Beauté', 'Tech', 'Autre']

const CATEGORY_COLORS: Record<string, string> = {
    Shopping: 'bg-pink-950/60 text-pink-300',
    Restaurant: 'bg-orange-950/60 text-orange-300',
    Loisirs: 'bg-violet-950/60 text-violet-300',
    Beauté: 'bg-rose-950/60 text-rose-300',
    Tech: 'bg-blue-950/60 text-blue-300',
    Autre: 'bg-zinc-800 text-zinc-400',
}

interface PageProps {
    searchParams: { categorie?: string; tri?: string }
}

async function getDepenses(categorie?: string, tri?: string) {
    const orderBy = tri === 'prix_asc' ? { prix: 'asc' as const }
        : tri === 'prix_desc' ? { prix: 'desc' as const }
            : { id: 'desc' as const } // défaut : plus récent

    return await prisma.depense.findMany({
        where: categorie ? { category: categorie } : undefined,
        orderBy,
    })
}

export default async function PageHistorique({ searchParams }: PageProps) {
    const { categorie, tri } = searchParams
    const depenses = await getDepenses(categorie, tri)

    const total = depenses.reduce((acc, d) => acc + d.prix, 0)
    const count = depenses.length

    return (
        <div className="min-h-screen bg-[#0d0d0d] font-sans flex flex-col">

            {/* Header */}
            <header className="bg-[#111111] border-b border-white/8 py-5 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
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
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[#CA3C66] leading-none">
                                Historique complet
                            </h1>
                            <p className="text-[11px] text-[#A7E0E0] mt-0.5">
                                {count} dépense{count !== 1 ? 's' : ''} — {total.toFixed(2)} € au total
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

                {/* Filtres (Client Component) */}
                <FiltresHistorique
                    categories={CATEGORIES}
                    categorieActive={categorie}
                    triActif={tri}
                />

                {/* Liste */}
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
                                    {/* Indicateur catégorie */}
                                    <div className="shrink-0 w-1 h-10 rounded-full bg-[#CA3C66]/60" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white/90 truncate">
                                            {depense.titre}
                                        </p>
                                        <span
                                            className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[depense.category] ?? 'bg-zinc-800 text-zinc-400'
                                                }`}
                                        >
                                            {depense.category}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-[#ED93B1] whitespace-nowrap shrink-0">
                                    {depense.prix.toFixed(2)} €
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer récap */}
                {depenses.length > 0 && (
                    <div className="bg-[#161616] border border-white/8 rounded-2xl px-5 py-4 flex justify-between items-center">
                        <p className="text-sm text-[#A7E0E0] font-semibold">
                            {count} dépense{count !== 1 ? 's' : ''} affichée{count !== 1 ? 's' : ''}
                        </p>
                        <p className="text-lg font-bold text-[#ED93B1]">{total.toFixed(2)} €</p>
                    </div>
                )}

            </div>
        </div>
    )
}