import { cookies } from "next/headers";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "./db";
import { hashToken, randomToken } from "./security";

const COOKIE_NAME = "azhari_staff_session";

export type StaffUser = {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
};

type StaffRow = RowDataPacket & {
  id: number;
  email: string;
  full_name: string;
  roles: string | null;
};

export async function createStaffSession(staffUserId: number, requestHeaders: Headers) {
  const token = randomToken(40);
  const sessionId = hashToken(token);
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
  const ip = requestHeaders.get("x-forwarded-for") || requestHeaders.get("x-real-ip") || "unknown";
  const ipHash = hashToken(ip.split(",")[0].trim());

  await db().execute(
    "INSERT INTO staff_sessions (id, staff_user_id, expires_at, ip_hash, user_agent) VALUES (?, ?, ?, ?, ?)",
    [sessionId, staffUserId, expiresAt, ipHash, (requestHeaders.get("user-agent") || "").slice(0, 500)]
  );

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
}

export async function destroyStaffSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) await db().execute("DELETE FROM staff_sessions WHERE id = ?", [hashToken(token)]);
  jar.delete(COOKIE_NAME);
}

export async function getStaffUser(): Promise<StaffUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [rows] = await db().execute<StaffRow[]>(
    `SELECT u.id, u.email, u.full_name, GROUP_CONCAT(r.code ORDER BY r.code) AS roles
       FROM staff_sessions s
       JOIN staff_users u ON u.id = s.staff_user_id AND u.is_active = 1
       LEFT JOIN staff_role_assignments a ON a.staff_user_id = u.id
       LEFT JOIN roles r ON r.id = a.role_id
      WHERE s.id = ? AND s.expires_at > UTC_TIMESTAMP()
      GROUP BY u.id, u.email, u.full_name
      LIMIT 1`,
    [hashToken(token)]
  );
  const row = rows[0];
  if (!row) return null;
  return { id: row.id, email: row.email, fullName: row.full_name, roles: row.roles ? row.roles.split(",") : [] };
}

export function canMakeFinalDecision(staff: StaffUser) {
  return staff.roles.includes("super_admin") || staff.roles.includes("recruitment_manager");
}
