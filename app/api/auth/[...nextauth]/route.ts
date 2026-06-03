// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma" // Importation de ton instance unique Prisma pour interagir avec MySQL

const handler = NextAuth({
    // Les "providers" définissent les méthodes de connexion (ex: Google, GitHub, ou ici par identifiants)
    providers: [
        CredentialsProvider({
            name: "Credentials",
            // On définit les champs attendus par le formulaire de NextAuth
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Mot de passe", type: "password" }
            },
            // Cette fonction contient la logique de vérification de l'utilisateur
            async authorize(credentials) {
                // Sécurité : on vérifie que l'email et le mot de passe ont bien été saisis
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                // Requête Prisma : on cherche un utilisateur unique dans la BDD correspondant à l'email fourni
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                // On vérifie si l'utilisateur existe ET si son mot de passe correspond à celui de la BDD
                // (Note : Si le prof utilise du hachage de mot de passe dans son blog, adapte cette ligne)
                if (user && user.mdp === credentials.password) {
                    // Si tout est bon, on renvoie un objet User. NextAuth va créer la session avec ces infos.
                    return { id: user.id, name: user.pseudo, email: user.email }
                }

                // Si les identifiants sont incorrects, on renvoie null (connexion refusée)
                return null
            }
        })
    ],
    // On personnalise les pages par défaut de NextAuth
    pages: {
        signIn: '/auth', // Indique à NextAuth d'utiliser TA page personnalisée pour la connexion
    },
    // Le secret sert à chiffrer les cookies de session (configuré dans ton fichier .env)
    secret: process.env.NEXTAUTH_SECRET,
})

// Dans l'architecture App Router de Next.js, on doit exporter les méthodes GET et POST
export { handler as GET, handler as POST }