import { NextRequest, NextResponse } from "next/server";
import { verifyJwt} from "@/lib/jwt";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function PATCH(req: NextRequest) {
    const taskId = req.nextUrl.pathname.split('/')[3];
    const { status } = await req.json();

    if(!["NOT_STARTED", "ON_PROGRESS", "DONE", "REJECT"].includes(status)) {
        return NextResponse.json({ message: "Invalid Status" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await pool.connect();

    try {
        const user = verifyJwt(token);

        if (!user) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        if (user.role === "TEAM") {
            const check = await client.query(
                'SELECT * FROM task_assignments WHERE task_id = $1 AND user_id = $2',
                [taskId, user.id]
            );

            if (check.rowCount === 0) {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
        }

        await client.query(
            'UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2',
            [status, taskId]
        );

        await client.query(
            'INSERT INTO task_logs (task_id, user_id, action) VALUES ($1, $2, $3)',
            [taskId, user.id, `Changed status to ${status}`]
        );

        return NextResponse.json({ message: "Status updated" });
    } catch (error) {
        console.log('❌ Error updating status:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}