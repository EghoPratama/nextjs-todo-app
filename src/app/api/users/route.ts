import { NextResponse} from "next/server";
import { verifyJwt} from "@/lib/jwt";
import { Pool} from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = verifyJwt(token) as { id: string; role: string };

        if (user.role !== "LEAD") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const client = await pool.connect();
        const result = await client.query(
            "SELECT id, name, email, role FROM users ORDER BY name"
        )
        client.release();

        return NextResponse.json({ users: result.rows });
    } catch (err) {
        console.error('❌ Error fetching users:', err)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}