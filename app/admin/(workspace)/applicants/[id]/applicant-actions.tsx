"use client";

import { useState } from "react";

const statuses = ["under_review", "more_information_required", "shortlisted", "interview_scheduled", "assessment_required", "documents_verification", "accepted", "waiting_list", "rejected", "withdrawn", "archived"];

export function ApplicantActions({ applicationId, currentStatus, noteOnly = false }: { applicationId: number; currentStatus?: string; noteOnly?: boolean }) {
  const [status, setStatus] = useState(currentStatus || "under_review");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function addNote(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/applications/${applicationId}/notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(result.message || "Unable to add note.");
    window.location.reload();
  }

  async function changeStatus() {
    setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/applications/${applicationId}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(result.message || "Unable to update status.");
    window.location.reload();
  }

  if (noteOnly) return <form className="note-form" onSubmit={addNote}><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a private note…" required minLength={2} maxLength={4000} /><button className="button button-dark" disabled={busy}>Add note</button>{message && <p className="form-message error">{message}</p>}</form>;

  return <div className="status-action"><select value={status} onChange={(e) => setStatus(e.target.value)}>{statuses.map((item) => <option value={item} key={item}>{item.replaceAll("_", " ")}</option>)}</select><button className="button button-dark" onClick={changeStatus} disabled={busy || status === currentStatus}>{busy ? "Updating…" : "Update stage"}</button>{message && <p className="form-message error">{message}</p>}</div>;
}
