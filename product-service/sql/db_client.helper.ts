import { Client } from 'pg';

const { DB_NAME, DB_USR, DB_PSSW, DB_ENDPOINT, DB_PORT } = process.env;
const db_options = {
    host: DB_ENDPOINT, port: DB_PORT, database: DB_NAME, user: DB_USR, password: DB_PSSW,
    ssl: {
        rejectUnauthorized: false // to awoid warnings
    },
    connectionTimeoutMillis: 5000
};

export const invoke = async (query, data = []) => {
    const client = new Client(db_options);
    console.debug("DB: initial connection");
    try {
        await client.connect();
        return await client.query(query, data);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`DB Error: [%o]`, error.message);
        throw new Error("DB manipulation.");
    } finally {
        client.end();
    }
}