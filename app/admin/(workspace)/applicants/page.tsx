import Link from "next/link";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";

type ApplicantRow = RowDataPacket & {
  id: number; reference_number: string; email: string; status: string; submitted_at: Date | null;
  full_name: string; country: string; specializations: string;
};

const statuses = ["submitted", "under_review", "more_information_required", "shortlisted", "interview_scheduled", "assessment_required", "documents_verification", "accepted", "waiting_list", "rejected", "withdrawn", "archived"];

export default async function ApplicantsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q = "", status = "" } = await searchParams;
  const conditions = ["a.status <> 'draft'"];
  const values: string[] = [];
  if (q.trim()) {
    conditions.push("(a.email LIKE ? OR a.reference_number LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(a.form_data, '$.fullNameEnglish')) LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(a.form_data, '$.fullNameArabic')) LIKE ?)");
    const term = `%${q.trim()}%`;
    values.push(term, term, term, term);
  }
  if (statuses.includes(status)) { conditions.push("a.status = ?"); values.push(status); }

  const [rows] = await db().execute<ApplicantRow[]>(
    `SELECT a.id, a.reference_number, a.email, a.status, a.submitted_at,
            COALESCE(JSON_UNQUOTE(JSON_EXTRACT(a.form_data, '$.fullNameEnglish')), a.email) AS full_name,
            COALESCE(JSON_UNQUOTE(JSON_EXTRACT(a.form_data, '$.country')), '—') AS country,
            COALESCE(JSON_UNQUOTE(JSON_EXTRACT(a.form_data, '$.specializations')), '[]') AS specializations
       FROM applications a
      WHERE ${conditions.join(" AND ")}
      ORDER BY COALESCE(a.submitted_at, a.updated_at) DESC
      LIMIT 200`,
    values
  );

  return <>
    <header className="admin-page-header"><div><p className="admin-kicker">Applicant pipeline</p><h1>Applicants</h1><p className="admin-muted">Search, review, and move candidates through the recruitment process.</p></div></header>
    <section className="admin-panel">
      <form className="admin-filters"><input name="q" defaultValue={q} placeholder="Search name, email, or reference…" /><select name="status" defaultValue={status}><option value="">All active statuses</option>{statuses.map((item) => <option value={item} key={item}>{item.replaceAll("_", " ")}</option>)}</select><button className="button button-dark">Apply filters</button></form>
      <div className="table-wrap"><table className="applicants-table"><thead><tr><th>Applicant</th><th>Specializations</th><th>Country</th><th>Status</th><th>Submitted</th></tr></thead><tbody>
        {rows.map((row) => { let specialties: string[] = []; try { specialties = JSON.parse(row.specializations); } catch { /* empty */ } return <tr key={row.id}><td><Link href={`/admin/applicants/${row.id}`}><strong>{row.full_name}</strong><small>{row.reference_number} · {row.email}</small></Link></td><td>{specialties.slice(0, 3).map((item) => <span className="mini-chip" key={item}>{item}</span>)}</td><td>{row.country}</td><td><span className={`status-badge status-${row.status}`}>{row.status.replaceAll("_", " ")}</span></td><td>{row.submitted_at ? new Date(row.submitted_at).toLocaleDateString("en-GB") : "—"}</td></tr>; })}
        {!rows.length && <tr><td colSpan={5}><p className="empty-state">No applicants match these filters.</p></td></tr>}
      </tbody></table></div>
    </section>
  </>;
}
