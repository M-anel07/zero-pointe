import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    const { pseudo, email, password } = await req.json()

    if (!email || !password) {
        return NextResponse.json({ message: 'Email et mot de passe requis.' }, { status: 400 })
    }

    const existant = await prisma.user.findFirst({
        where: { OR: [{ email }, ...(pseudo ? [{ pseudo }] : [])] },
    })

    if (existant) {
        return NextResponse.json({ message: 'Email ou pseudo déjà utilisé.' }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 12)

    await prisma.user.create({
        data: { email, pseudo: pseudo || null, mdp: hash },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
}