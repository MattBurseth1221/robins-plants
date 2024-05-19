import { NextApiRequest, NextApiResponse } from 'next';
import pg from 'pg';
const { Pool } = pg;

// const DB_HOST = process.env.DB_HOST;
// const DB_USER = process.env.DB_USER;
// const DB_PASSWORD = process.env.DB_PASSWORD;

type ResponseData = {
    message: string
}

const pool = new Pool();

export async function GET() {
    const queryResult = (await pool.query('SELECT NOW()')).rows[0].now;

    console.log((await pool.query('SELECT NOW()')).rows[0].now);
    return Response.json({message: 'Hello!', now: queryResult});
}