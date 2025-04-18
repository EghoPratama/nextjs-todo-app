import { NextResponse } from 'next/server'
import { signJwt } from '@/app/lib/jwt'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export async function POST(req: Request) {
    console.log('📥 Incoming login request')

    try {
        const rawBody = await req.text()
        console.log('📦 Raw Body:', rawBody)

        const { email, password } = JSON.parse(rawBody)
        console.log('🔍 Parsed:', { email, password })

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password required' }, { status: 400 })
        }

        const client = await pool.connect()
        console.log('✅ Connected to DB')

        const result = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )
        console.log('🔍 Query result:', result.rows)

        const user = result.rows[0]

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        console.log('✅ Password match:', isMatch)

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 })
        }

        const token = signJwt({
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
        })

        console.log('🎫 JWT:', token)

        return NextResponse.json({ token })
    } catch (error) {
        console.error('❌ Internal error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
