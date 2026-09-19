import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db, withTransaction } from "./db";
import { hashToken, randomToken } from "./security";

type ApplicationRow = RowDataPacket & {
  id: number;
  reference_number: string;
  email: string;
  preferred_locale: "en" | "ar";
  status: string;
  form_data: string | Record<string, unknown> | null;
};

export async function issueApplicationAccess(email: string, locale: "en" | "ar") {
  const rawToken = randomToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const result = await withTransaction(async (connection) => {
    const [existing] = await connection.execute<ApplicationRow[]>(
      "SELECT id, reference_number, email, preferred_locale, status, form_data FROM applications WHERE email = ? AND status = 'draft' ORDER BY id DESC LIMIT 1 FOR UPDATE",
      [email]
    );
    let applicationId: number;
    let reference: string;

    if (existing[0]) {
      applicationId = existing[0].id;
      reference = existing[0].reference_number;
      await connection.execute("UPDATE applications SET preferred_locale = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?", [locale, applicationId]);
    } else {
      reference = `AA-${new Date().getUTCFullYear()}-${randomToken(5).toUpperCase()}`;
      const [insert] = await connection.execute<ResultSetHeader>(
        "INSERT INTO applications (reference_number, email, preferred_locale, status, current_step, form_data) VALUES (?, ?, ?, 'draft', 0, JSON_OBJECT())",
        [reference, email, locale]
      );
      applicationId = insert.insertId;
    }

    await connection.execute("DELETE FROM secure_access_tokens WHERE application_id = ? AND purpose = 'applicant_access'", [applicationId]);
    await connection.execute(
      "INSERT INTO secure_access_tokens (application_id, token_hash, purpose, expires_at) VALUES (?, ?, 'applicant_access', ?)",
      [applicationId, tokenHash, expiresAt]
    );
    return { applicationId, reference };
  });

  return { ...result, rawToken };
}

export async function applicationFromToken(token: string) {
  const tokenHash = hashToken(token);
  const [rows] = await db().execute<ApplicationRow[]>(
    `SELECT a.id, a.reference_number, a.email, a.preferred_locale, a.status, a.form_data
       FROM secure_access_tokens t
       JOIN applications a ON a.id = t.application_id
      WHERE t.token_hash = ? AND t.purpose = 'applicant_access' AND t.expires_at > UTC_TIMESTAMP()
      LIMIT 1`,
    [tokenHash]
  );
  return rows[0] || null;
}

export async function saveDraft(token: string, step: number, data: Record<string, unknown>, locale: "en" | "ar") {
  const application = await applicationFromToken(token);
  if (!application || application.status !== "draft") return null;
  await db().execute(
    "UPDATE applications SET form_data = ?, current_step = GREATEST(current_step, ?), preferred_locale = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?",
    [JSON.stringify(data), step, locale, application.id]
  );
  return application;
}

export async function submitApplication(token: string, data: Record<string, unknown>, locale: "en" | "ar") {
  const application = await applicationFromToken(token);
  if (!application || application.status !== "draft") return null;

  await withTransaction(async (connection) => {
    await connection.execute(
      "UPDATE applications SET form_data = ?, preferred_locale = ?, status = 'submitted', submitted_at = UTC_TIMESTAMP(), updated_at = UTC_TIMESTAMP() WHERE id = ? AND status = 'draft'",
      [JSON.stringify(data), locale, application.id]
    );
    await connection.execute(
      "INSERT INTO application_status_history (application_id, from_status, to_status, note) VALUES (?, 'draft', 'submitted', 'Application submitted by applicant')",
      [application.id]
    );
  });
  return application;
}
