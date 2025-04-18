// src/app/api/users/me/route.ts
import { NextResponse } from 'next/server'
import { verifyJwt } from '@/lib/jwt'

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const user = verifyJwt(token)

        return NextResponse.json({ user })
    } catch (err) {
        console.error('❌ Invalid token:', err)
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
}
