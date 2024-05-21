import { pool } from "../../_lib/db";

export async function GET(request: Request) {
    const limit = new URL(request.url).searchParams.get('limit');

    const postQuery = `SELECT * FROM posts LIMIT ${limit}`;
    const queryResult = (await pool.query(postQuery)).rows[0];

    //console.log((await pool.query('SELECT NOW()')).rows[0].now);
    return Response.json({message: 'Hello!', result: queryResult});
}
