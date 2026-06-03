// app/composants/FormulaireDepense.tsx
'use client'

import { useRef } from 'react'
import { creerDepense } from '../actions/depense'

export default function FormulaireDepense() {
    const formRef = useRef<HTMLFormElement>(null)

    async function handleAction(formData: FormData) {
        await creerDepense(formData)
        formRef.current?.reset()
    }

    return (
        <div className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden w-full">
            {/* Header */}
            <div className="px-7 py-5 border-b border-white/8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    Nouvelle dépense
                </p>
            </div>

            {/* Form */}
            <form ref={formRef} action={handleAction} className="px-7 py-6 space-y-5">
                {/* Titre */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="titre"
                        className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500"
                    >
                        Objet du craquage
                    </label>
                    <input
                        type="text"
                        id="titre"
                        name="titre"
                        required
                        placeholder="Ex: Paire de baskets, Sushi à 23h…"
                        className="w-full px-4 py-2.5 bg-[#1f1f1f] border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#CA3C66]/40 focus:border-[#CA3C66]/60 transition"
                    />
                </div>

                {/* Prix + Catégorie */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label
                            htmlFor="prix"
                            className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500"
                        >
                            Montant (€)
                        </label>
                        <input
                            type="number"
                            id="prix"
                            name="prix"
                            step="0.01"
                            min="0"
                            required
                            placeholder="0.00"
                            className="w-full px-4 py-2.5 bg-[#1f1f1f] border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#CA3C66]/40 focus:border-[#CA3C66]/60 transition"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="categorie"
                            className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500"
                        >
                            Catégorie
                        </label>
                        <div className="relative">
                            <select
                                id="categorie"
                                name="categorie"
                                required
                                className="w-full px-4 py-2.5 bg-[#1f1f1f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#CA3C66]/40 focus:border-[#CA3C66]/60 appearance-none cursor-pointer transition"
                            >
                                <option value="Shopping">Shopping</option>
                                <option value="Restaurant">Restaurant</option>
                                <option value="Loisirs">Loisirs</option>
                                <option value="Beauté">Beauté</option>
                                <option value="Tech">Tech</option>
                                <option value="Autre">Autre</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full mt-1 py-3 bg-[#CA3C66] hover:bg-[#b8345a] active:scale-[0.98] text-white text-xs font-semibold uppercase tracking-[0.1em] rounded-xl transition-all duration-150"
                >
                    Ajouter la dépense
                </button>
            </form>
        </div>
    )
}