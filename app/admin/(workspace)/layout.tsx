import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/admin-auth";
import { AdminShell } from "../admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaffUser();
  if (!user) redirect("/admin/login");
  return <AdminShell userName={user.fullName}>{children}</AdminShell>;
}
