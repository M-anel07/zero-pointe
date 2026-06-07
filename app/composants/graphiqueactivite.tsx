"use client"

interface Donnee {
    mois: string
    valeur: number
}

interface Props {
    donnees: Donnee[]
}

export default function GraphiqueActivite({ donnees }: Props) {
    const max = Math.max(...donnees.map(d => d.valeur), 1)
    const HAUTEUR = 56

    return (
        <div className="px-4 py-3 flex flex-col gap-2">
            <div
                className="w-full flex items-end justify-between gap-1"
                style={{ height: `${HAUTEUR}px` }}
            >
                {donnees.map((d, i) => {
                    const hauteurPx = Math.max((d.valeur / max) * HAUTEUR, 3)
                    const estActif = d.valeur > 0
                    return (
                        <div
                            key={i}
                            className="flex-1 rounded-sm transition-all duration-300"
                            style={{
                                height: `${hauteurPx}px`,
                                background: estActif
                                    ? "rgba(202, 60, 102, 0.7)"
                                    : "rgba(255, 255, 255, 0.08)",
                            }}
                        />
                    )
                })}
            </div>
            <div className="flex items-center justify-between gap-1">
                {donnees.map((d, i) => (
                    <span key={i} className="text-[8px] text-zinc-700 flex-1 text-center truncate">
                        {d.mois}
                    </span>
                ))}
            </div>
        </div>
    )
}