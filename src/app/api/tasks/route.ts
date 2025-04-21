import {NextRequest, NextResponse} from 'next/server'
import { verifyJwt } from '@/lib/jwt'
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

export async function POST(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyJwt(token);
    if (!user) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { title, description, assignee } = await req.json();

    if (!title || !description) {
        return NextResponse.json({ message: "Title and assignee are required" }, { status: 400 });
    }

    if (user.role === 'TEAM' && assignee !== user.id) {
        return NextResponse.json({ message: 'TEAM can only assign to themselves' }, { status: 403 })
    }

    const client = await pool.connect();

    try {
        const result = await client.query(
            'INSERT INTO tasks (title, description, status, created_by) VALUES ($1, $2, $3, $4) RETURNING id',
            [title, description, 'NOT_STARTED', user.id]
        );

        const taskId = result.rows[0].id;

        await client.query(
            'INSERT INTO task_assignments (task_id, user_id) VALUES ($1, $2)',
            [taskId, assignee]
        );

        await client.query(
            'INSERT INTO task_logs (task_id, user_id, action) VALUES ($1, $2, $3)',
            [taskId, user.id, `Created task and assigned to user ${assignee}`]
        );

        return NextResponse.json({ message: 'Task created' }, { status: 201 })
    } catch (err) {
        console.error('❌ Error creating task:', err)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
