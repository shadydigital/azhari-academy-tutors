import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import mysql from "mysql2/promise";

const [emailArg, nameArg] = process.argv.slice(2);
const password = process.env.ADMIN_PASSWORD;
if (!emailArg || !nameArg || !password || password.length < 12) {
  console.error("Usage: ADMIN_PASSWORD='at-least-12-characters' npm run admin:create -- admin@example.com 'Admin Name'");
  process.exit(1);
}

const scrypt = promisify(scryptCallback);
const salt = randomBytes(16).toString("hex");
const derived = await scrypt(password, salt, 64);
const passwordHash = `scrypt$${salt}$${Buffer.from(derived).toString("hex")}`;
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || "3306", 10),
  socketPath: process.env.DB_SOCKET || undefined,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  charset: "utf8mb4"
});

try {
  await connection.beginTransaction();
  const [result] = await connection.execute(
    "INSERT INTO staff_users (email, full_name, password_hash) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash), is_active = 1",
    [emailArg.trim().toLowerCase(), nameArg.trim(), passwordHash]
  );
  const userId = result.insertId || (await connection.execute("SELECT id FROM staff_users WHERE email = ?", [emailArg.trim().toLowerCase()]))[0][0].id;
  await connection.execute(
    "INSERT IGNORE INTO staff_role_assignments (staff_user_id, role_id) SELECT ?, id FROM roles WHERE code = 'super_admin'",
    [userId]
  );
  await connection.commit();
  console.log(`Super admin ready: ${emailArg.trim().toLowerCase()}`);
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
