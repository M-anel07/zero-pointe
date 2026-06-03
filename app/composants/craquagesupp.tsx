// app/composants/craquagesupp.tsx
'use client'

import { useState } from 'react'

interface Depense {
    id: string
    titre: string
    prix: number
    category: string
    rejets: number
    approbations: number
}

const CATEGORY_COLORS: Record<string, string> = {
    Shopping: 'bg-pink-950/60 text-pink-300',
    Restaurant: 'bg-orange-950/60 text-orange-300',
    Loisirs: 'bg-violet-950/60 text-violet-300',
    Beauté: 'bg-rose-950/60 text-rose-300',
    Tech: 'bg-blue-950/60 text-blue-300',
    Autre: 'bg-zinc-800 text-zinc-400',
}

export default function FluxCaniveauClient({ depensesInitiales }: { depensesInitiales: Depense[] }) {
    // État pour savoir si on affiche tout ou seulement les 10 premiers
    const [afficherTout, setAfficherTout] = useState(false)

    if (depensesInitiales.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-zinc-600 text-sm border border-dashed border-white/8 rounded-2xl bg-[#111111] w-full">
                Aucun vote pour l'instant. Le caniveau est vide.
            </div>
        )
    }

    // On découpe à 10 si "afficherTout" est faux
    const depensesVisibles = afficherTout ? depensesInitiales : depensesInitiales.slice(0, 10)
    const aPlusDeDix = depensesInitiales.length > 10

    return (
        <div className="space-y-8 w-full">
            {/* Grille calée à 5 cartes max par ligne sur écran large */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                {depensesVisibles.map((depense, index) => (
                    <div
                        key={depense.id}
                        className="bg-[#161616] border border-white/8 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden w-full"
                    >
                        <div className="absolute top-0 right-0 bg-[#CA3C66]/10 text-[#CA3C66] font-black px-3 py-1 rounded-bl-xl text-xs">
                            #{index + 1}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-start gap-3 pr-8">
                                <h3 className="text-base font-semibold text-white/90 truncate">
                                    {depense.titre}
                                </h3>
                            </div>
                            <span className="text-xl font-black text-[#ED93B1] block">
                                {depense.prix.toFixed(2)} €
                            </span>

                            <div className="flex items-center gap-2">
                                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[depense.category] ?? 'bg-zinc-800 text-zinc-400'}`}>
                                    {depense.category}
                                </span>
                                <span className="text-[11px] text-zinc-500 font-medium">
                                    {depense.rejets} rejets
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/4">
                            <button className="py-1.5 px-2 bg-[#4AA3A2] text-slate-800 font-bold rounded-xl text-[10px] uppercase tracking-wider text-center">
                                Utile ({depense.approbations})
                            </button>
                            <button className="py-1.5 px-2 bg-[#CA3C66] text-white font-bold rounded-xl text-[10px] uppercase tracking-wider text-center">
                                Compulsif ({depense.rejets})
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bouton "Voir plus" affiché uniquement si on dépasse 10 et qu'on n'a pas encore tout déplié */}
            {aPlusDeDix && !afficherTout && (
                <div className="flex justify-center pt-4 w-full">
                    <button
                        onClick={() => setAfficherTout(true)}
                        className="py-3 px-8 bg-[#161616] border border-white/8 text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center">  
                        Voir tous les craquages       
                    </button>
                </div>
            )}
        </div>
    )
}