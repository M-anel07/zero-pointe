'use client'

import { useState } from 'react'
import { inscriptionUser } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PageInscription() {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    async function clientAction(formData: FormData) {
        setError('')
        setSuccess('')

        const reponse = await inscriptionUser(formData)

        if (reponse?.error) {
            setError(reponse.error)
        } else if (reponse?.success) {
            setSuccess(reponse.success)
            setTimeout(() => {
                router.push('/auth')
            }, 2000)
        }
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6 text-slate-200">
            <form action={clientAction} className="bg-[#161616] border border-white/10 rounded-2xl p-8 max-w-sm w-full space-y-4">
                <h2 className="text-xl font-extrabold text-[#CA3C66]">Inscription</h2>

                {error && <p className="text-xs text-red-400">{error}</p>}
                {success && <p className="text-xs text-green-400">{success}</p>}

                <input type="text" name="pseudo" placeholder="Pseudo" required className="w-full px-4 py-2 bg-[#1f1f1f] border border-white/10 rounded-xl text-sm" />
                <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-2 bg-[#1f1f1f] border border-white/10 rounded-xl text-sm" />
                <input type="password" name="password" placeholder="Mot de passe" required className="w-full px-4 py-2 bg-[#1f1f1f] border border-white/10 rounded-xl text-sm" />

                <button type="submit" className="w-full py-2.5 bg-[#CA3C66] text-white font-bold rounded-xl text-xs uppercase tracking-wider">
                    Créer mon compte
                </button>
                <p className="text-xs text-center text-zinc-500">
                    Déjà un compte ? <Link href="/auth" className="text-[#CA3C66] hover:underline">Se connecter</Link>
                </p>
            </form>
        </div>
    )
}