'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Vote {
  type: string
  userId?: string
}

interface Depense {
  id: string
  titre: string
  prix: number
  category: string
  rejets: number
  approbations: number
  votes?: Vote[]
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
  const { data: session } = useSession()
  const [depenses, setDepenses] = useState(depensesInitiales)
  const [afficherTout, setAfficherTout] = useState(false)
  // Map depenseId -> 'SHAMEFUL' | 'VALIDATED' | null
  const [mesVotes, setMesVotes] = useState<Record<string, string | null>>({})

  // Polling toutes les 10 secondes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/votes/depenses')
        if (res.ok) {
          const data = await res.json()
          setDepenses(data)
        }
      } catch {
        // silencieux
      }
    }, 10_000)
    return () => clearInterval(interval)
  }, [])

  async function voter(depenseId: string, type: 'SHAMEFUL' | 'VALIDATED') {
    if (!session) return

    const ancienVote = mesVotes[depenseId] ?? null
    const nouveauVote = ancienVote === type ? null : type

    // Mise à jour optimiste
    setMesVotes(prev => ({ ...prev, [depenseId]: nouveauVote }))
    setDepenses(prev =>
      prev.map(d => {
        if (d.id !== depenseId) return d
        let { rejets, approbations } = d
        if (ancienVote === 'SHAMEFUL') rejets--
        if (ancienVote === 'VALIDATED') approbations--
        if (nouveauVote === 'SHAMEFUL') rejets++
        if (nouveauVote === 'VALIDATED') approbations++
        return { ...d, rejets, approbations }
      }).sort((a, b) => b.rejets - a.rejets)
    )

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depenseId, type }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      // Resync avec les vraies valeurs serveur
      setDepenses(prev =>
        prev.map(d =>
          d.id === depenseId
            ? { ...d, rejets: data.rejets, approbations: data.approbations }
            : d
        ).sort((a, b) => b.rejets - a.rejets)
      )
      setMesVotes(prev => ({ ...prev, [depenseId]: data.monVote }))
    } catch {
      // Rollback
      setDepenses(depensesInitiales)
      setMesVotes({})
    }
  }

  if (depenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-600 text-sm border border-dashed border-white/8 rounded-2xl bg-[#111111] w-full">
        Aucun vote pour l'instant. Le caniveau est vide.
      </div>
    )
  }

  const depensesVisibles = afficherTout ? depenses : depenses.slice(0, 10)
  const aPlusDeDix = depenses.length > 10

  return (
    <div className="space-y-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
        {depensesVisibles.map((depense, index) => {
          const monVote = mesVotes[depense.id] ?? null

          return (
            <div
              key={depense.id}
              className="bg-[#161616] border border-white/8 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden w-full"
            >
              {/* Badge rang */}
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
                    {depense.rejets} rejet{depense.rejets !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Boutons de vote */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/4">
                <button
                  onClick={() => voter(depense.id, 'VALIDATED')}
                  disabled={!session}
                  title={!session ? 'Connectez-vous pour voter' : monVote === 'VALIDATED' ? 'Annuler mon vote' : 'Voter Utile'}
                  className={`py-1.5 px-2 font-bold rounded-xl text-[10px] uppercase tracking-wider text-center transition-all
                    ${monVote === 'VALIDATED'
                      ? 'bg-[#4AA3A2] text-slate-800 ring-2 ring-[#4AA3A2]/50 scale-95'
                      : 'bg-[#4AA3A2]/80 text-slate-800 hover:bg-[#4AA3A2]'
                    }
                    ${!session ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  Utile ({depense.approbations})
                </button>
                <button
                  onClick={() => voter(depense.id, 'SHAMEFUL')}
                  disabled={!session}
                  title={!session ? 'Connectez-vous pour voter' : monVote === 'SHAMEFUL' ? 'Annuler mon vote' : 'Voter Compulsif'}
                  className={`py-1.5 px-2 font-bold rounded-xl text-[10px] uppercase tracking-wider text-center transition-all
                    ${monVote === 'SHAMEFUL'
                      ? 'bg-[#CA3C66] text-white ring-2 ring-[#CA3C66]/50 scale-95'
                      : 'bg-[#CA3C66]/80 text-white hover:bg-[#CA3C66]'
                    }
                    ${!session ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  Compulsif ({depense.rejets})
                </button>
              </div>

              {/* Indicateur si non connecté */}
              {!session && (
                <p className="text-[9px] text-zinc-600 text-center -mt-2">
                  Connectez-vous pour voter
                </p>
              )}
            </div>
          )
        })}
      </div>

      {aPlusDeDix && !afficherTout && (
        <div className="flex justify-center pt-4 w-full">
          <button
            onClick={() => setAfficherTout(true)}
            className="py-3 px-8 bg-[#161616] border border-white/8 text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center"
          >
            Voir tous les craquages
          </button>
        </div>
      )}
    </div>
  )
}