'use server' // Cette directive indique que ce fichier contient des actions côté serveur, exécutées dans un environnement Node.js

// On importe l'instance unique qu'on vient de configurer dans lib/prisma
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function creerDepense(formData: FormData) {
    const titre = formData.get('titre') as string
    const prix = parseFloat(formData.get('prix') as string)
    const categorie = formData.get('categorie') as string

    // Validation de sécurité rapide
    if (!titre || isNaN(prix) || !categorie) {
        throw new Error("Tous les champs sont obligatoires.")
    }

    try {
        // Insertion dans ta table MySQL via Prisma
        await prisma.depense.create({
            data: {
                titre: titre,
                prix: prix,
                category: categorie, // Correspond au champ 'category' de ton schéma
                userId: "1" // ID temporaire en attendant de créer l'authentification
            },
        })

        // On demande à Next.js de rafraîchir la page pour afficher le nouveau craquage
        revalidatePath('/')

    } catch (erreur) {
        console.error("Erreur lors de l'ajout du craquage :", erreur)
        throw new Error("Impossible d'enregistrer le craquage en bdd.")
    }
}