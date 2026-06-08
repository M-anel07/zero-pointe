"use client"

import { useState } from "react"

type Donnee = {
    mois: string
    valeur: number
}

export default function GraphiqueActivite({ donnees }: { donnees: Donnee[] }) {
    const max = Math.max(...donnees.map(d => d.valeur), 1)
    const [actif, setActif] = useState<number | null>(null)

    const handleClick = (index: number) => {
        setActif(index === actif ? null : index)
    }

    const moisActif = actif !== null ? donnees[actif] : null

    return (
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">

            {/* Tooltip inline sous le titre */}
            <div
                className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300"
                style={{
                    background: moisActif
                        ? "rgba(202,60,102,0.08)"
                        : "rgba(255,255,255,0.03)",
                    borderColor: moisActif
                        ? "rgba(202,60,102,0.35)"
                        : "rgba(255,255,255,0.06)",
                }}
            >
                <div>
                    <p
                        className="text-[9px] uppercase tracking-[2px] font-bold transition-colors duration-200"
                        style={{ color: moisActif ? "rgba(202,60,102,0.8)" : "rgb(82,82,91)" }}
                    >
                        {moisActif ? `${moisActif.mois} · sélectionné` : "cliquer une barre"}
                    </p>
                    <p
                        className="text-2xl font-bold mt-0.5 transition-all duration-300"
                        style={{ color: moisActif ? "#ffffff" : "rgb(63,63,70)" }}
                    >
                        {moisActif
                            ? moisActif.valeur > 0
                                ? moisActif.valeur.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
                                : "—"
                            : "—"
                        }
                    </p>
                </div>
                {moisActif && (
                    <button
                        onClick={() => setActif(null)}
                        className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Barres */}
            <div className="flex items-end gap-1.5 h-36">
                {donnees.map((d, i) => {
                    const hauteur = max > 0 ? Math.max((d.valeur / max) * 100, d.valeur > 0 ? 5 : 0) : 0
                    const estActif = actif === i

                    return (
                        <div
                            key={i}
                            className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
                            onClick={() => handleClick(i)}
                            title={`${d.mois} : ${d.valeur > 0 ? d.valeur.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }) : "0 €"}`}
                        >
                            <div className="w-full flex items-end justify-center" style={{ height: "112px" }}>
                                <div
                                    className="w-full rounded-t transition-all duration-300"
                                    style={{
                                        height: `${hauteur}%`,
                                        minHeight: d.valeur > 0 ? "6px" : "2px",
                                        background: estActif
                                            ? "#CA3C66"
                                            : d.valeur > 0
                                                ? "rgba(202,60,102,0.50)"
                                                : "rgba(255,255,255,0.08)",
                                        boxShadow: estActif ? "0 0 14px rgba(202,60,102,0.55)" : "none",
                                        transform: estActif ? "scaleX(1.06)" : "scaleX(1)",
                                    }}
                                />
                            </div>
                            <span
                                className="text-[9px] font-bold uppercase tracking-wide transition-colors duration-200"
                                style={{ color: estActif ? "#CA3C66" : "rgb(113,113,122)" }}
                            >
                                {d.mois}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}