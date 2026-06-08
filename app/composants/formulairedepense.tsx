// app/composants/formulairedepense.tsx
'use client'

import { useState, useTransition } from 'react'
import { creerDepense } from '../actions/depense' // Import de ton action serveur

const CATEGORIES = ['Shopping', 'Restaurant', 'Beauté', 'Tech', 'Nourriture', 'Jeux', 'Autre']

export default function FormulaireDepense() {
    const [category, setCategory] = useState('')
    const [customCategory, setCustomCategory] = useState('')
    const [isPending, startTransition] = useTransition() // Pour gérer le chargement pendant l'action

    // Handler pour intercepter et modifier la catégorie si besoin
    async function handleAction(formData: FormData) {
        // Si c'est "Autre", on force la valeur custom dans le formData
        if (category === 'Autre' && customCategory) {
            formData.set('categorie', customCategory)
        } else {
            formData.set('categorie', category) // On mappe 'category' du select vers 'categorie' attendu par le serveur
        }

        // On lance l'action serveur
        startTransition(async () => {
            try {
                await creerDepense(formData)
                // Reset du formulaire après succès
                setCategory('')
                setCustomCategory('')
                const form = document.getElementById('form-craquage') as HTMLFormElement
                form?.reset()
            } catch (error) {
                console.error(error)
                alert("Erreur lors de l'enregistrement.")
            }
        })
    }

    return (
        <form 
            id="form-craquage"
            action={handleAction} 
            className="bg-[#161616] border border-white/8 rounded-2xl p-6 space-y-4 w-full"
        >
            <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Ajouter un craquage
                </h3>
            </div>

            {/* Inputs Titre et Prix */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#A7E0E0] font-semibold">Titre</label>
                    <input
                        type="text"
                        name="titre"
                        required
                        placeholder="Ex: Un lego Star Wars"
                        className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#CA3C66]/60 transition"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-[#A7E0E0] font-semibold">Prix (€)</label>
                    <input
                        type="number"
                        name="prix"
                        step="0.01"
                        required
                        placeholder="0.00"
                        className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#CA3C66]/60 transition"
                    />
                </div>
            </div>

            {/* Select Catégorie */}
            <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#A7E0E0] font-semibold">
                    Catégorie
                </label>
                <div className="relative">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#CA3C66]/60 transition appearance-none cursor-pointer"
                    >
                        <option value="" disabled className="text-zinc-600">Choisir une catégorie</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} className="bg-[#161616] text-white">
                                {cat}
                            </option>
                        ))}
                    </select>
                    {/* Flèche custom en SVG */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Input bonus s'il choisit "Autre" */}
            {category === 'Autre' && (
                <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-[10px] uppercase tracking-widest text-[#A7E0E0] font-semibold">
                        Nom de la catégorie personnalisée
                    </label>
                    <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        required
                        placeholder="Ex: Kebab, Moto, Karting..."
                        className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#CA3C66]/60 transition"
                    />
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#CA3C66] hover:bg-[#b8335a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors"
            >
                {isPending ? 'Enregistrement...' : 'Enregistrer le craquage'}
            </button>
        </form>
    )
}
