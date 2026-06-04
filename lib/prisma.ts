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

    // En prod, on parse DATABASE_URL pour l'adaptateur MariaDB
    const url = new URL(process.env.DATABASE_URL!)
    const adapter = new PrismaMariaDb({
        host: url.hostname,
        port: parseInt(url.port || '3306'),
        user: url.username,
        password: url.password,
        database: url.pathname.replace('/', ''),
        connectionLimit: 5,
        ssl: { rejectUnauthorized: false },
    })
    return new PrismaClient({ adapter })
}

const prisma = global.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
}

export default prisma