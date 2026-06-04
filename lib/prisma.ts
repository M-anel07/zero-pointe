import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@/app/generated/prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

function createClient() {
    if (process.env.NODE_ENV !== 'production') {
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

    // En prod, Prisma lit DATABASE_URL directement depuis le schema
    return new PrismaClient()
}

const prisma = global.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
}

export default prisma