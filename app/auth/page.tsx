// app/auth/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PageConnexion() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        // On appelle NextAuth avec le provider 'credentials' configuré dans la route API
        const resultat = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false, // Empêche NextAuth de recharger brutalement la page
        })

        if (resultat?.error) {
            setError("Identifiants incorrects.")
        } else {
            // Connexion réussie ! On redirige l'utilisateur vers l'accueil
            router.push('/')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6 text-slate-200">
            <form onSubmit={handleSubmit} className="bg-[#161616] border border-white/8 rounded-2xl p-8 max-w-sm w-full space-y-4">
                <div>
                    <h2 className="text-xl font-extrabold text-[#CA3C66]">Connexion</h2>
                    <p className="text-xs text-zinc-500">Accédez au tribunal de vos craquages</p>
                </div>

                {error && <p className="text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-900/50">{error}</p>}

                <div className="space-y-1">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-[#1f1f1f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#CA3C66]"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-[#1f1f1f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#CA3C66]"
                    />
                </div>

                <button type="submit" className="w-full py-2.5 bg-[#CA3C66] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition hover:bg-[#b8345a]">
                    Se connecter
                </button>

                <p className="text-xs text-center text-zinc-500 mt-4">
  Pas de compte ?{' '}
  <Link href="/inscription" className="text-[#CA3C66] hover:underline font-semibold">
    Inscrivez-vous ici
  </Link>
</p>

            </form>
        </div>
    )
} 