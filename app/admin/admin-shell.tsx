"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminShell({ userName, children }: { userName: string; children: React.ReactNode }) {
  const pathname = usePathname();
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }
  const links = [["/admin", "Overview"], ["/admin/applicants", "Applicants"]];
  return <div className="admin-shell">
    <aside className="admin-nav">
      <Link href="/admin" className="brand admin-brand"><span className="brand-mark">ا</span><span><strong>Azhari</strong><small>Recruitment</small></span></Link>
      <nav>{links.map(([href, label]) => <Link key={href} href={href} className={pathname === href ? "active" : ""}>{label}</Link>)}</nav>
      <div className="admin-user"><span>{userName}</span><button onClick={logout}>Sign out</button></div>
    </aside>
    <main className="admin-main">{children}</main>
  </div>;
}
