'use server'

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function inscriptionUser(formData: FormData) {
    const email = formData.get('email') as string
    const mdp = formData.get('password') as string
    const pseudo = formData.get('pseudo') as string

    if (!email || !mdp || !pseudo) {
        return { error: "Tous les champs sont obligatoires." }
    }

    try {
        const existeDeja = await prisma.user.findUnique({
            where: { email: email }
        })

        if (existeDeja) {
            return { error: "Cet email est déjà utilisé." }
        }

        const hash = await bcrypt.hash(mdp, 12)

        await prisma.user.create({
            data: {
                email,
                mdp: hash,
                pseudo
            }
        })

return { success: "Inscription réussie !" }

    } catch (error) {
        console.error(error)
        return { error: "Une erreur est survenue lors de l'inscription." }
    }
}