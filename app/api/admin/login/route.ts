import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import { createStaffSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { normalizeEmail } from "@/lib/security";

export const runtime = "nodejs";

type LoginRow = RowDataPacket & { id: number; password_hash: string };
const schema = z.object({ email: z.email().max(190), password: z.string().min(8).max(200) });

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "Invalid email or password." }, { status: 400 });
    const [rows] = await db().execute<LoginRow[]>("SELECT id, password_hash FROM staff_users WHERE email = ? AND is_active = 1 LIMIT 1", [normalizeEmail(parsed.data.email)]);
    const user = rows[0];
    if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }
    await createStaffSession(user.id, request.headers);
    await db().execute("UPDATE staff_users SET last_login_at = UTC_TIMESTAMP() WHERE id = ?", [user.id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ message: "Sign in is temporarily unavailable." }, { status: 503 });
  }
}
