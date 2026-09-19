import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  let user = null;
  try { user = await getStaffUser(); } catch { /* database may not be configured during first setup */ }
  if (user) redirect("/admin");

  return <main className="admin-login-page"><section className="admin-login-card">
    <div className="brand admin-login-brand"><span className="brand-mark">ا</span><span><strong>Azhari</strong><small>Academy</small></span></div>
    <p className="admin-kicker">Recruitment workspace</p>
    <h1>Staff sign in</h1>
    <p className="admin-muted">Access applications, interviews, and recruitment decisions.</p>
    <LoginForm />
    <a className="admin-back-link" href="/en">← Return to website</a>
  </section></main>;
}
