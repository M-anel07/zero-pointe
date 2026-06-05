import 'server-only' // 🛡️ Sécurité : Empêche strictement d'importer ce fichier côté client (navigateur)
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@/app/generated/prisma/client'

// Configuration optimisée pour une base de données distante sur Aiven
const configurationAiven = {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'zero-pointe',
    connectionLimit: 10,       // Monte à 10 pour encaisser le polling sans saturer Aiven
    connectTimeout: 15000,     // 15 secondes max pour laisser le temps au réseau d'atteindre Aiven
    waitForConnections: true,  // Met les requêtes en attente si le pool est temporairement plein
    queueLimit: 0,             // Pas de limite de file d'attente pour éviter les crashs secs
}

// Utilisation de globalThis pour le Singleton (évite de recréer des pools au Hot Reload en Dev)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createClient() {
    let adapter;

    if (process.env.NODE_ENV !== 'production') {
        // En mode Développement
        adapter = new PrismaMariaDb(configurationAiven)
    } else {
        // En mode Production : On extrait dynamiquement les variables depuis DATABASE_URL si nécessaire,
        // ou on réutilise la config Aiven classique selon tes variables d'environnement de prod.
        if (process.env.DATABASE_URL) {
            const url = new URL(process.env.DATABASE_URL)
            adapter = new PrismaMariaDb({
                host: url.hostname,
                port: parseInt(url.port || '3306'),
                user: url.username,
                password: url.password,
                database: url.pathname.replace('/', ''),
                connectionLimit: 10,
                connectTimeout: 15000,
                ssl: { rejectUnauthorized: false }, // Souvent requis en production selon l'hébergeur cloud
            })
        } else {
            adapter = new PrismaMariaDb(configurationAiven)
        }
    }

    return new PrismaClient({ adapter })
}

// On récupère l'instance globale existante ou on en crée une nouvelle
export const prisma = globalForPrisma.prisma ?? createClient()

// En développement, on sauvegarde l'instance dans le scope global
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma