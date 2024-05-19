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

export default async function GET(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log(await pool.query('SELECT NOW()'));
    res.status(200).json({message: 'Hello!'});
}