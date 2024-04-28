import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema"
const { Client } = pg;
/**
 * Alias of schema
 */
export const tables = schema;
const client = new Client({
    connectionString: process.env.DATABASE_URL!,
    connectionTimeoutMillis: 5000,
});
export const db = drizzle(client);
await client.connect();
