import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import { canMakeFinalDecision, getStaffUser } from "@/lib/admin-auth";
import { db, withTransaction } from "@/lib/db";

const statuses = ["under_review", "more_information_required", "shortlisted", "interview_scheduled", "assessment_required", "documents_verification", "accepted", "waiting_list", "rejected", "withdrawn", "archived"] as const;
const schema = z.object({ status: z.enum(statuses), reason: z.string().trim().max(2000).optional() });
type StatusRow = RowDataPacket & { status: string };

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const staff = await getStaffUser();
  if (!staff) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const applicationId = Number.parseInt((await params).id, 10);
  const parsed = schema.safeParse(await request.json());
  if (!Number.isFinite(applicationId) || !parsed.success) return NextResponse.json({ message: "Invalid stage." }, { status: 400 });
  if (["accepted", "rejected"].includes(parsed.data.status) && !canMakeFinalDecision(staff)) return NextResponse.json({ message: "You do not have permission to make a final decision." }, { status: 403 });
  const [rows] = await db().execute<StatusRow[]>("SELECT status FROM applications WHERE id = ? LIMIT 1", [applicationId]);
  if (!rows[0]) return NextResponse.json({ message: "Application not found." }, { status: 404 });
  await withTransaction(async (connection) => {
    await connection.execute("UPDATE applications SET status = ?, archived_at = IF(? = 'archived', UTC_TIMESTAMP(), archived_at), updated_at = UTC_TIMESTAMP() WHERE id = ?", [parsed.data.status, parsed.data.status, applicationId]);
    await connection.execute("INSERT INTO application_status_history (application_id, from_status, to_status, changed_by, note) VALUES (?, ?, ?, ?, ?)", [applicationId, rows[0].status, parsed.data.status, staff.id, parsed.data.reason || null]);
    await connection.execute("INSERT INTO audit_logs (staff_user_id, application_id, action, entity_type, entity_id, metadata) VALUES (?, ?, 'status.changed', 'application', ?, ?)", [staff.id, applicationId, String(applicationId), JSON.stringify({ from: rows[0].status, to: parsed.data.status })]);
  });
  return NextResponse.json({ ok: true });
}
