import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL belum diatur. Salin .env.example menjadi .env lalu isi kredensial PostgreSQL.",
  );
}

const globalForDb = globalThis as unknown as {
  __kemenhajSql?: ReturnType<typeof postgres>;
};

const sql =
  globalForDb.__kemenhajSql ??
  postgres(connectionString, {
    max: process.env.NODE_ENV === "production" ? 10 : 4,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__kemenhajSql = sql;
}

export const db = drizzle(sql, { schema });
export { sql };
