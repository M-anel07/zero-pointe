// app/page.tsx
import Link from 'next/link'
import prisma from '@/lib/prisma'
import FluxCaniveauClient from './composants/craquagesupp'

function getLimitesSemaine() {
  const maintenant = new Date()
  const lundi = new Date(maintenant)
  const jour = lundi.getDay()
  const décalage = jour === 0 ? -6 : 1 - jour
  lundi.setDate(lundi.getDate() + décalage)
  lundi.setHours(0, 0, 0, 0)

  const dimanche = new Date(lundi)
  dimanche.setDate(dimanche.getDate() + 6)
  dimanche.setHours(23, 59, 59, 999)

  return { lundi, dimanche }
}

async function getDepensesSemaine() {
  const { lundi, dimanche } = getLimitesSemaine()

  const depenses = await prisma.depense.findMany({
    where: {
      creerLe: {
        gte: lundi,
        lte: dimanche,
      },
    },
    include: {
      votes: {
        select: {
          type: true
        }
      }
    }
  })

  // Formatage et tri par rejets
  return depenses
    .map((d) => {
      const rejets = d.votes.filter(v => v.type === "SHAMEFUL").length
      const approbations = d.votes.filter(v => v.type === "VALIDATED").length
      return { ...d, rejets, approbations }
    })
    .sort((a, b) => b.rejets - a.rejets)
}

export default async function PageAccueil() {
  const toutesLesDepenses = await getDepensesSemaine()
  const totalTop1 = toutesLesDepenses.length > 0 ? toutesLesDepenses[0].prix : 0

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans flex flex-col text-slate-200 w-full">

      {/* Header */}
      <header className="bg-[#111111] border-b border-white/8 py-5 sticky top-0 z-10 w-full">
        <div className="w-full px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#CA3C66] leading-none">
              Zéro Pointé
            </h1>
            <p className="text-[11px] text-[#A7E0E0] mt-1.5 tracking-wide uppercase">
              Le tribunal de la honte
            </p>
          </div>

          <div className="text-right max-w-[200px] flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.08em] text-[#A7E0E0] font-semibold block leading-tight">
              Somme du Top 1 Rejeté
            </p>
            <p className="text-xl font-black text-[#CA3C66] mt-1 leading-none">
              {totalTop1.toFixed(2)} €
            </p>
          </div>

          <Link
            href="/auth"
            className="flex items-center gap-2 px-4 py-2 bg-[#CA3C66] hover:bg-[#b8335a] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
          >
            Connexion
          </Link>

        </div>
      </header>

      {/* Flux Principal géré par le composant client */}
      <main className="flex-1 w-full px-8 py-8 space-y-6">
        <div className="flex justify-between items-center border-b border-white/8 pb-3 w-full">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider text-sm">
            Les craquages de la semaine
          </h2>
        </div>

        <FluxCaniveauClient depensesInitiales={toutesLesDepenses} />
      </main>

      <footer className="mt-auto bg-[#111111] border-t border-white/8 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wide">
          <p className="text-zinc-500 font-medium">
            &copy; {new Date().getFullYear()} Zéro Pointé. Aucun droit réservé, contrôlez vos finances.
          </p>
          <div className="flex gap-6 text-[#A7E0E0] font-semibold uppercase text-[10px] tracking-wider">
            <span className="text-xs text-zinc-500">Mise à jour dimanche à 23h59</span>

          </div>
          <div>
            <span className="text-zinc-600 font-normal normal-case text-xs">Fait avec soin</span>

          </div>
        </div>
      </footer>

    </div>
  )
}