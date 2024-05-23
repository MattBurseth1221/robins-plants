import { pool } from "../../_lib/db";

export async function GET(request: Request) {
    const limit = new URL(request.url).searchParams.get('limit');

    const postQuery = `SELECT * FROM posts LIMIT ${limit}`;
    const queryResult = (await pool.query(postQuery)).rows;

    return Response.json({message: 'Hello!', result: queryResult});
}
