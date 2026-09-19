"use client";

import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      window.location.href = "/admin";
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to sign in."); }
    finally { setBusy(false); }
  }

  return <form className="admin-login-form" onSubmit={submit}>
    <label>Email address<input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
    <label>Password<input type="password" required minLength={8} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
    {message && <p className="form-message error">{message}</p>}
    <button className="button button-dark" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
  </form>;
}
