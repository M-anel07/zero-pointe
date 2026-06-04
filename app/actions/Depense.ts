'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function creerDepense(formData: FormData) {
    const titre = formData.get('titre') as string
    const prix = parseFloat(formData.get('prix') as string)
    const categorie = formData.get('categorie') as string

    if (!titre || isNaN(prix) || !categorie) {
        throw new Error("Tous les champs sont obligatoires.")
    }

    try {
        await prisma.depense.create({
            data: {
                titre: titre,
                prix: prix,
                category: categorie,
                userId: "1"
            },
        })

        // Revalider toutes les pages qui affichent des dépenses
        revalidatePath('/dashboard')
        revalidatePath('/historique')

    } catch (erreur) {
        console.error("Erreur lors de l'ajout du craquage :", erreur)
        throw new Error("Impossible d'enregistrer le craquage en bdd.")
    }
}