// lib/prisma.ts
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
    const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST || '127.0.0.1',
        port: parseInt(process.env.DATABASE_PORT || '3306'),
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'zero-pointe',
        connectionLimit: 5,
    })

    // En Prisma 7, l'adapter se passe comme ça :
    return new PrismaClient({ adapter })
}

// Ici on appelle BIEN la fonction createClient() si prisma n'existe pas déjà
const prisma = global.prisma ?? createClient()

// En développement, on sauvegarde l'instance dans le scope global
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma