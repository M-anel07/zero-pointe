// app/composants/FiltresHistorique.tsx
'use client'

import { useRouter, usePathname } from 'next/navigation'

const TRI_OPTIONS = [
  { value: 'recent',    label: 'Plus récent' },
  { value: 'prix_desc',  label: 'Prix ↑' },
  { value: 'prix_asc',   label: 'Prix ↓' },
]

interface Props {
  categories: string[]
  categorieActive?: string
  triActif?: string
}

export default function FiltresHistorique({ categories, categorieActive, triActif }: Props) {
  const router   = useRouter()
  const pathname = usePathname()

  function buildUrl(newCategorie?: string, newTri?: string) {
    const params = new URLSearchParams()
    if (newCategorie) params.set('categorie', newCategorie)
    if (newTri && newTri !== 'recent') params.set('tri', newTri)
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  function onCategorie(cat: string) {
    const next = cat === categorieActive ? undefined : cat
    router.push(buildUrl(next, triActif))
  }

  function onTri(tri: string) {
    router.push(buildUrl(categorieActive, tri))
  }

  return (
    <div className="flex items-center gap-8 w-full bg-[#111111] border border-white/8 rounded-2xl px-5 py-3.5 overflow-x-auto scrollbar-none whitespace-nowrap">

      {/* Section Tri */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-semibold">
          Trier par
        </span>
        <div className="flex gap-2">
          {TRI_OPTIONS.map((opt) => {
            const active = (triActif ?? 'recent') === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onTri(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#CA3C66] text-white'
                    : 'bg-white/6 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/8'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Séparateur vertical */}
      <div className="w-px h-6 bg-white/10 shrink-0" />

      {/* Section Catégories */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-500 font-semibold">
          Catégorie
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onCategorie('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !categorieActive
                ? 'bg-[#A7E0E0]/20 text-[#A7E0E0] border border-[#A7E0E0]/30'
                : 'bg-white/6 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/8'
            }`}
          >
            Toutes
          </button>
          {categories.map((cat) => {
            const active = categorieActive === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategorie(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#A7E0E0]/20 text-[#A7E0E0] border border-[#A7E0E0]/30'
                    : 'bg-white/6 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/8'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
