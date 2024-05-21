import pg from 'pg';
const { Pool } = pg;

// const DB_HOST = process.env.DB_HOST;
// const DB_USER = process.env.DB_USER;
// const DB_PASSWORD = process.env.DB_PASSWORD;

export const pool = new Pool();

export interface DatabaseUser {
	id: string;
	username: string;
	password_hash: string;
}