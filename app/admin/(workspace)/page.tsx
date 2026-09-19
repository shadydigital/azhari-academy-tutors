import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";

type CountRow = RowDataPacket & { status: string; total: number };
type InterviewRow = RowDataPacket & { id: number; starts_at: Date; interview_type: string; reference_number: string; full_name: string };

export default async function AdminDashboard() {
  const [countsResult, interviewsResult] = await Promise.all([
    db().execute<CountRow[]>("SELECT status, COUNT(*) AS total FROM applications GROUP BY status"),
    db().execute<InterviewRow[]>(`SELECT i.id, i.starts_at, i.interview_type, a.reference_number, COALESCE(JSON_UNQUOTE(JSON_EXTRACT(a.form_data, '$.fullNameEnglish')), a.email) AS full_name FROM interviews i JOIN applications a ON a.id = i.application_id WHERE i.status = 'scheduled' AND i.starts_at >= UTC_TIMESTAMP() ORDER BY i.starts_at LIMIT 6`)
  ]);
  const counts = Object.fromEntries(countsResult[0].map((row) => [row.status, Number(row.total)]));
  const interviews = interviewsResult[0];
  const cards = [["New applications", counts.submitted || 0], ["Under review", counts.under_review || 0], ["Shortlisted", counts.shortlisted || 0], ["Awaiting assessment", counts.assessment_required || 0]];

  return <>
    <header className="admin-page-header"><div><p className="admin-kicker">Recruitment overview</p><h1>Good to see you.</h1><p className="admin-muted">Here is what needs attention across the hiring pipeline.</p></div><a className="button button-dark" href="/admin/applicants">Review applicants</a></header>
    <section className="metric-grid">{cards.map(([label, value]) => <article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong></article>)}</section>
    <section className="admin-panel"><div className="panel-header"><div><p className="admin-kicker">Schedule</p><h2>Upcoming interviews</h2></div></div>
      {interviews.length ? <div className="interview-list">{interviews.map((item) => <div key={item.id}><span className="date-chip">{new Date(item.starts_at).toLocaleDateString("en", { month: "short", day: "numeric" })}</span><div><strong>{item.full_name}</strong><small>{item.reference_number} · {item.interview_type.replaceAll("_", " ")}</small></div><time>{new Date(item.starts_at).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" })}</time></div>)}</div> : <p className="empty-state">No upcoming interviews are scheduled.</p>}
    </section>
  </>;
}
