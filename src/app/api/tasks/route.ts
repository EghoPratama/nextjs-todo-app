import { NextResponse } from 'next/server'
import { verifyJwt } from '@/app/lib/jwt'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const user = verifyJwt(token) as {
            id: string
            role: 'LEAD' | 'TEAM'
        }

        const client = await pool.connect()
        let query: string
        let params: any[] = []

        if (user.role === 'LEAD') {
            query = `
                SELECT t.id, t.title, t.description, t.status, u.id as assignee_id, u.name as assignee_name
                FROM tasks t
                LEFT JOIN task_assignments ta ON ta.task_id = t.id
                LEFT JOIN users u ON u.id = ta.user_id
                ORDER BY t.updated_at DESC
            `
        } else {
            query = `
                SELECT t.id, t.title, t.description, t.status
                FROM tasks t
                JOIN task_assignments ta ON ta.task_id = t.id
                WHERE ta.user_id = $1
                ORDER BY t.updated_at DESC
              `
            params = [user.id]
        }

        const result = await client.query(query, params)

        return NextResponse.json({ tasks: result.rows })
    } catch (err) {
        console.error('❌ Failed to fetch tasks:', err)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
