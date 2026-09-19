import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStaffUser } from "@/lib/admin-auth";
import { db, withTransaction } from "@/lib/db";

const schema = z.object({ note: z.string().trim().min(2).max(4000) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const staff = await getStaffUser();
  if (!staff) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const applicationId = Number.parseInt((await params).id, 10);
  const parsed = schema.safeParse(await request.json());
  if (!Number.isFinite(applicationId) || !parsed.success) return NextResponse.json({ message: "Invalid note." }, { status: 400 });
  await withTransaction(async (connection) => {
    await connection.execute("INSERT INTO internal_notes (application_id, author_id, body) VALUES (?, ?, ?)", [applicationId, staff.id, parsed.data.note]);
    await connection.execute("INSERT INTO audit_logs (staff_user_id, application_id, action, entity_type, entity_id) VALUES (?, ?, 'note.created', 'application', ?)", [staff.id, applicationId, String(applicationId)]);
  });
  return NextResponse.json({ ok: true });
}
