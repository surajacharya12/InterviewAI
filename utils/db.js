// utils/db.js

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// ✅ Optional: Only needed outside Next.js (like scripts)
// import 'dotenv/config'

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing. Check your .env file.");
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
