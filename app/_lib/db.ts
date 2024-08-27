import postgres from "postgres";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const sql = postgres(`postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`);

// const DB_HOST = process.env.DB_HOST;
// const DB_USER = process.env.DB_USER;
// const DB_PASSWORD = process.env.DB_PASSWORD;

export interface DatabaseUser {
	id: string;
	username: string;
	password_hash: string;
}