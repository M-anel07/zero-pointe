import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@/app/generated/prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

function createClient() {
    // Si on est sur Vercel (Production), on force l'URL d'Aiven dans l'environnement
    if (process.env.NODE_ENV === 'production') {
        if (process.env.DATABASE_URL) {
            process.env.DATABASE_URL = process.env.DATABASE_URL;
        }
        return new PrismaClient()
    }

    // Sinon, on garde ta configuration XAMPP locale pour toi et Lucas
    const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST || '127.0.0.1',
        port: parseInt(process.env.DATABASE_PORT || '3306'),
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'zero-pointe',
        connectionLimit: 5,
    })

    return new PrismaClient({ adapter })
}

const prisma = global.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
}

export default prisma