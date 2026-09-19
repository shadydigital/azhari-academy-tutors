import { notFound } from "next/navigation";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { listValue, parseFormData, textValue } from "@/lib/form-data";
import { ApplicantActions } from "./applicant-actions";

type ApplicationRow = RowDataPacket & { id: number; reference_number: string; email: string; status: string; preferred_locale: string; form_data: unknown; submitted_at: Date | null; created_at: Date };
type HistoryRow = RowDataPacket & { id: number; from_status: string | null; to_status: string; note: string | null; created_at: Date; staff_name: string | null };
type NoteRow = RowDataPacket & { id: number; body: string; created_at: Date; staff_name: string };

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isFinite(id)) notFound();
  const [applicationResult, historyResult, notesResult] = await Promise.all([
    db().execute<ApplicationRow[]>("SELECT id, reference_number, email, status, preferred_locale, form_data, submitted_at, created_at FROM applications WHERE id = ? LIMIT 1", [id]),
    db().execute<HistoryRow[]>("SELECT h.id, h.from_status, h.to_status, h.note, h.created_at, u.full_name AS staff_name FROM application_status_history h LEFT JOIN staff_users u ON u.id = h.changed_by WHERE h.application_id = ? ORDER BY h.created_at DESC", [id]),
    db().execute<NoteRow[]>("SELECT n.id, n.body, n.created_at, u.full_name AS staff_name FROM internal_notes n JOIN staff_users u ON u.id = n.author_id WHERE n.application_id = ? ORDER BY n.created_at DESC", [id])
  ]);
  const application = applicationResult[0][0];
  if (!application) notFound();
  const data = parseFormData(application.form_data);
  const fullName = textValue(data, "fullNameEnglish") || textValue(data, "fullNameArabic") || application.email;
  const facts = [
    ["Arabic name", textValue(data, "fullNameArabic")], ["Phone", textValue(data, "phone")], ["Location", [textValue(data, "city"), textValue(data, "country")].filter(Boolean).join(", ")],
    ["Time zone", textValue(data, "timezone")], ["Qualification", textValue(data, "qualification")], ["Institution", textValue(data, "institution")],
    ["Experience", `${textValue(data, "yearsExperience") || "—"} years`], ["Weekly capacity", `${textValue(data, "weeklyHours") || "—"} hours`]
  ];

  return <>
    <header className="applicant-header"><div><a className="admin-back-link" href="/admin/applicants">← Applicants</a><div className="applicant-title-row"><h1>{fullName}</h1><span className={`status-badge status-${application.status}`}>{application.status.replaceAll("_", " ")}</span></div><p className="admin-muted">{application.reference_number} · {application.email}</p></div><ApplicantActions applicationId={id} currentStatus={application.status} /></header>
    <div className="applicant-grid">
      <div className="applicant-primary">
        <section className="admin-panel"><div className="panel-header"><h2>Profile</h2></div><dl className="facts-grid">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl></section>
        <section className="admin-panel"><div className="panel-header"><h2>Teaching profile</h2></div><div className="detail-block"><h3>Specializations</h3><div>{listValue(data, "specializations").map((item) => <span className="mini-chip" key={item}>{item}</span>)}</div></div><div className="detail-block"><h3>Learner groups</h3><p>{listValue(data, "ageGroups").join(", ") || "—"}</p></div><div className="detail-block"><h3>Teaching languages</h3><p>{textValue(data, "teachingLanguages") || "—"}</p></div></section>
        <section className="admin-panel"><div className="panel-header"><h2>Experience and motivation</h2></div>{[["Online teaching", "onlineExperience"], ["Previous work", "previousWork"], ["Motivation", "motivation"], ["Teaching children", "childScenario"]].map(([label, key]) => <div className="detail-block" key={key}><h3>{label}</h3><p>{textValue(data, key) || "—"}</p></div>)}</section>
        <section className="admin-panel"><div className="panel-header"><h2>Availability and setup</h2></div>{[["Availability", "availability"], ["Device", "device"], ["Internet and backup", "internet"], ["Introductory video", "videoUrl"]].map(([label, key]) => <div className="detail-block" key={key}><h3>{label}</h3><p>{textValue(data, key) || "—"}</p></div>)}</section>
      </div>
      <aside className="applicant-aside">
        <section className="admin-panel"><div className="panel-header"><h2>Internal notes</h2></div><ApplicantActions applicationId={id} noteOnly />{notesResult[0].map((note) => <article className="note" key={note.id}><p>{note.body}</p><small>{note.staff_name} · {new Date(note.created_at).toLocaleString("en-GB")}</small></article>)}</section>
        <section className="admin-panel"><div className="panel-header"><h2>Timeline</h2></div><div className="timeline">{historyResult[0].map((item) => <div key={item.id}><span /><article><strong>{item.to_status.replaceAll("_", " ")}</strong><p>{item.note || "Status updated"}</p><small>{item.staff_name || "Applicant"} · {new Date(item.created_at).toLocaleString("en-GB")}</small></article></div>)}</div></section>
      </aside>
    </div>
  </>;
}
