import mysql, { type Pool, type PoolConnection, type RowDataPacket } from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __azhariDbPool: Pool | undefined;
}

function databaseConfig() {
  const required = ["DB_NAME", "DB_USER"] as const;
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Database is not configured. Missing: ${missing.join(", ")}`);

  return {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number.parseInt(process.env.DB_PORT || "3306", 10),
    socketPath: process.env.DB_SOCKET || undefined,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    charset: "utf8mb4",
    connectionLimit: 8,
    enableKeepAlive: true,
    timezone: "Z"
  };
}

export function db(): Pool {
  if (!global.__azhariDbPool) global.__azhariDbPool = mysql.createPool(databaseConfig());
  return global.__azhariDbPool;
}

export async function withTransaction<T>(work: (connection: PoolConnection) => Promise<T>): Promise<T> {
  const connection = await db().getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export type DatabaseRow = RowDataPacket & Record<string, unknown>;
