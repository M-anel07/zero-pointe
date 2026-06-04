// app/page.tsx
import prisma from '@/lib/prisma'
import Link from 'next/link'
import FormulaireDepense from '../composants/formulairedepense'

async function getDepenses() {
    return await prisma.depense.findMany({
        orderBy: { id: 'desc' },
    })
}

const CATEGORY_COLORS: Record<string, string> = {
    Shopping: 'bg-pink-950/60 text-pink-300',
    Restaurant: 'bg-orange-950/60 text-orange-300',
    Beauté: 'bg-rose-950/60 text-rose-300',
    Tech: 'bg-blue-950/60 text-blue-300',
    Food: 'bg-amber-950/60 text-amber-300',
    Jeux: 'bg-cyan-950/60 text-cyan-300',
    Autre: 'bg-violet-950/60 text-violet-300',
}

export default async function PageAccueil() {
    const depenses = await getDepenses()

    const total = depenses.reduce((acc, d) => acc + d.prix, 0)
    const count = depenses.length
    const moyenne = count > 0 ? total / count : 0
    const max = count > 0 ? Math.max(...depenses.map((d) => d.prix)) : 0

    // Modification ici : on ne garde que 4 éléments pour l'historique rapide
    const recentes = depenses.slice(0, 4)
    const hasMore = count > 4

    return (
        <div className="min-h-screen bg-[#0d0d0d] font-sans flex flex-col">

            {/* Header */}
            <header className="bg-[#111111] border-b border-white/8 py-5 sticky top-0 z-10 w-full">
                <div className="w-full px-8 flex justify-between items-center">
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
                                Dashboard
                            </h1>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.1em] text-[#A7E0E0] font-semibold">
                            Total cumulé
                        </p>
                        <p className="text-xl font-bold text-[#CA3C66] leading-tight">
                            {total.toFixed(2)} €
                        </p>
                    </div>
                </div>
            </header>

            {/* Layout */}
            <div className="flex-1 flex flex-col lg:flex-row w-full px-8 py-8 gap-8">
                {/* Colonne gauche */}
                <main className="flex-1 flex flex-col gap-6">

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4">
                            <p className="text-[10px] uppercase tracking-[0.1em] text-[#A7E0E0] font-semibold mb-1">Dépenses</p>
                            <p className="text-2xl font-bold text-white">{count}</p>
                        </div>
                        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4">
                            <p className="text-[10px] uppercase tracking-[0.1em] text-[#A7E0E0] font-semibold mb-1">Moyenne</p>
                            <p className="text-2xl font-bold text-white">{moyenne.toFixed(2)} €</p>
                        </div>
                        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4">
                            <p className="text-[10px] uppercase tracking-[0.1em] text-[#A7E0E0] font-semibold mb-1">Record</p>
                            <p className="text-2xl font-bold text-[#CA3C66]">{max.toFixed(2)} €</p>
                        </div>
                    </div>

                    {/* Formulaire */}
                    <FormulaireDepense />
                </main>

                {/* Colonne droite — Historique */}
                <aside className="w-full lg:w-[380px] flex flex-col">
                    <div className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden flex flex-col">

                        {/* Header */}
                        <div className="px-6 py-5 border-b border-white/8">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A7E0E0]">
                                Historique
                            </p>
                            <p className="text-lg font-bold text-white mt-0.5">
                                Derniers craquages
                            </p>
                        </div>

                        {/* Liste — 4 max */}
                        <div className="px-4 py-4 space-y-2.5">
                            {recentes.length === 0 ? ( 
                                <div className="flex items-center justify-center h-32 text-zinc-600 text-sm border border-dashed border-white/8 rounded-xl">
                                    Aucun craquage pour le moment.
                                </div>
                            ) : (
                                recentes.map((depense) => (
                                    <div
                                        key={depense.id}
                                        className="bg-white/4 border border-white/6 rounded-xl px-4 py-3 flex items-start justify-between gap-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white/90 truncate">
                                                {depense.titre}
                                            </p>
                                            <span
                                                className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[depense.category] ?? 'bg-zinc-800 text-zinc-400'
                                                    }`}
                                            >
                                                {depense.category}
                                            </span>
                                        </div>
                                        <p className="text-base font-bold text-[#ED93B1] whitespace-nowrap pt-0.5">
                                            {depense.prix.toFixed(2)} €
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 pb-4 pt-1 border-t border-white/8 mt-1 flex items-center justify-between gap-3">
                            <p className="text-[11px] text-[#A7E0E0] uppercase tracking-[0.1em] font-semibold px-2">
                                Total&nbsp;: <span className="text-[#ED93B1]">{total.toFixed(2)} €</span>
                            </p>
                            {hasMore && (
                                <Link
                                    href="/historique"
                                    className="flex items-center gap-1.5 px-4 py-2 bg-white/6 border border-white/10 rounded-xl text-xs font-semibold text-white/70"
                                >
                                    Voir tout
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                        </div>

                    </div>
                </aside>

            </div>
            {/* Footer */}
            <footer className="mt-auto bg-[#111111] border-t border-white/8 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wide">
                    <p className="text-zinc-500 font-medium">
                        &copy; {new Date().getFullYear()} Zéro Pointé. Aucun droit réservé, contrôlez vos finances.
                    </p>
                    <div className="flex gap-6 text-[#A7E0E0] font-semibold uppercase text-[10px] tracking-wider">
                        <span className="text-zinc-600 font-normal normal-case text-xs">Fait avec soin</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}